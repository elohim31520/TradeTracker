const db = require('../../models')
const { calculateMean, calculateStdDev, calculateCorrelation } = require('../modules/math')
const { MOVING_AVERAGE, BTCUSD, USOIL, DXY, US10Y, XAUUSD } = require('../constant/market')
const { getZonedDate, subtractDays, getStartOfToday, getEndOfToday } = require('../modules/date')

const KEY_MAP = {
	BTCUSD: 'btc',
	USOIL: 'usoil',
	DXY: 'dxy',
	US10Y: 'us10y',
}

class MarketIndexService {
	async create(params) {
		const data = await db.MarketIndex.create(params)
		return data
	}

	async getAll() {
		const data = db.MarketIndex.findAll()
		return data
	}

	async getMomentumData(data) {
		const consolidatedData = new Map()
		const addDataToMap = (data, key) => {
			data.forEach(({ createdAt, volume }) => {
				if (!consolidatedData.has(createdAt)) {
					consolidatedData.set(createdAt, { createdAt, btc: 0, usoil: 0, dxy: 0, us10y: 0 })
				}
				consolidatedData.get(createdAt)[key] = volume
			})
		}

		const getStandardizedValue = (values, currentValue) => {
			const mean = calculateMean(values)
			const stdDev = calculateStdDev(values, mean)
			const diff = currentValue - mean

			if (diff == 0) return 0
			const epsilon = 1e-6
			if (Math.abs(stdDev) < epsilon) return 0

			const standardizedValue = diff / stdDev
			return parseFloat(standardizedValue.toFixed(2))
		}

		const standardizeData = (data) => {
			const prices = data.map((item) => item.price)
			return data.map((item, index) => {
				const windowPrices = index < MOVING_AVERAGE ? prices : prices.slice(Math.max(0, index - MOVING_AVERAGE), index)
				return { ...item, volume: getStandardizedValue(windowPrices, item.price) }
			})
		}

		const btcData = data.filter((vo) => vo.symbol == BTCUSD)
		const usoilData = data.filter((vo) => vo.symbol == USOIL)
		const dxyData = data.filter((vo) => vo.symbol == DXY)
		const us10YData = data.filter((vo) => vo.symbol == US10Y)

		const btc_standardized = standardizeData(btcData)
		const dxy_standardized = standardizeData(dxyData)
		const usoil_standardized = standardizeData(usoilData)
		const us10y_standardized = standardizeData(us10YData)

		addDataToMap(btc_standardized, KEY_MAP[BTCUSD])
		addDataToMap(usoil_standardized, KEY_MAP[USOIL])
		addDataToMap(dxy_standardized, KEY_MAP[DXY])
		addDataToMap(us10y_standardized, KEY_MAP[US10Y])

		const btcVolumes = btc_standardized.map((item) => item.volume)
		const dxyVolumes = dxy_standardized.map((item) => item.volume)
		const usoilVolumes = usoil_standardized.map((item) => item.volume)
		const us10yVolumes = us10y_standardized.map((item) => item.volume)

		// 動態權重
		const baseWeight = 0.1
		const btcWeight = Math.max(
			0.6,
			0.8 + baseWeight * calculateCorrelation(btcVolumes.slice(-MOVING_AVERAGE), btcVolumes.slice(-MOVING_AVERAGE))
		)
		const dxyWeight =
			baseWeight * calculateCorrelation(btcVolumes.slice(-MOVING_AVERAGE), dxyVolumes.slice(-MOVING_AVERAGE))
		const usoilWeight =
			baseWeight * calculateCorrelation(btcVolumes.slice(-MOVING_AVERAGE), usoilVolumes.slice(-MOVING_AVERAGE))
		let us10Weight =
			baseWeight *
			Math.abs(calculateCorrelation(btcVolumes.slice(-MOVING_AVERAGE), us10yVolumes.slice(-MOVING_AVERAGE)))

		console.log(`權重 btc: ${btcWeight}, dxy: ${dxyWeight}, usoil: ${usoilWeight}, us10y: ${us10Weight}`)

		const finalResult = Array.from(consolidatedData.values()).map(({ createdAt, btc, usoil, dxy, us10y }) => {
			// 高利率情景
			if (us10y > 4.5) us10Weight *= 2
			const volume = btc * btcWeight + dxyWeight * dxy + usoilWeight * usoil + us10Weight * us10y

			return {
				ct: createdAt,
				v: parseFloat(volume.toFixed(2)),
			}
		})

		return finalResult
	}

	async getLstOne(symbol) {
		const lastOne = await db.MarketIndex.findOne({
			include: [{
				model: db.Asset,
				as: 'asset',
				where: { symbol },
				attributes: ['symbol']
			}],
			order: [['created_at', 'DESC']],
			raw: true,
			nest: true
		});
	
		if (!lastOne) return null;

		return {
			...lastOne,
			symbol: lastOne.asset.symbol
		};
	}

	async getDataByDateRange(rangeInDays) {
		const startDate = subtractDays(getZonedDate(), rangeInDays)
		const rawQuery = `
			WITH RankedData AS (
				SELECT
					m.id,
					m.asset_id,
					m.price,
					m.\`change\`,
					-- 修正：保留原始格式化邏輯
					DATE_FORMAT(m.created_at, '%Y-%m-%d %H') AS hourGroup,
					ROW_NUMBER() OVER (
						-- 修正：改用 asset_id 進行分區，這比字串比對更快
						PARTITION BY m.asset_id, DATE_FORMAT(m.created_at, '%Y-%m-%d %H')
						-- 修正：通常取每小時最後一筆用 created_at DESC
						ORDER BY m.created_at DESC
					) as rn
				FROM
					market_index m
				WHERE
					m.created_at >= :startDate
			)
			SELECT
				a.symbol,
				r.price,
				r.\`change\`,
				r.hourGroup AS createdAt
			FROM
				RankedData r
			-- 修正：透過 JOIN 拿回 symbol
			JOIN assets a ON r.asset_id = a.id
			WHERE
				r.rn = 1
			ORDER BY
				a.symbol, r.hourGroup;
		`
	
		const results = await db.sequelize.query(rawQuery, {
			replacements: { startDate: startDate },
			type: db.sequelize.QueryTypes.SELECT,
			raw: true,
		})
	
		return results
	}

	async getMomentumByDateRange(rangeInDays) {
		const data = await this.getDataByDateRange(rangeInDays)
		return this.getMomentumData(data)
	}

	async getAllMomentum() {
		const data = await this.getDataByDateRange(3650)
		return this.getMomentumData(data)
	}

	async getWeights() {
		const data = await this.getDataByDateRange(MOVING_AVERAGE)
		const getPrices = (symbol) => data.filter((d) => d.symbol === symbol).map((d) => d.price)

		const prices = {
			[BTCUSD]: getPrices(BTCUSD),
			[DXY]: getPrices(DXY),
			[USOIL]: getPrices(USOIL),
			[US10Y]: getPrices(US10Y),
			[XAUUSD]: getPrices(XAUUSD),
		}

		const btcSlice = prices.BTCUSD.slice(-MOVING_AVERAGE)
		const baseWeight = 0.1
		const getCorrelation = (values, values2) => baseWeight * calculateCorrelation(values, values2)

		return {
			[BTCUSD]: Number(Math.max(0.6, 0.8 + getCorrelation(btcSlice, btcSlice)).toFixed(3)),
			[DXY]: Number(getCorrelation(btcSlice, prices.DXY.slice(-MOVING_AVERAGE)).toFixed(3)),
			[USOIL]: Number(getCorrelation(btcSlice, prices.USOIL.slice(-MOVING_AVERAGE)).toFixed(3)),
			[US10Y]: Number(getCorrelation(btcSlice, prices.US10Y.slice(-MOVING_AVERAGE)).toFixed(3)),
			[XAUUSD]: Number(getCorrelation(btcSlice, prices.XAUUSD.slice(-MOVING_AVERAGE)).toFixed(3)),
		}
	}

	async getMarketDataBySymbol({symbol, page, size}) {
		const res = await db.MarketIndex.findAll({
			include: [
				{
					model: db.Asset,
					as: 'asset',
					where: { symbol },
					attributes: ['symbol'],
				}
			],
			order: [['created_at', 'DESC']],
			offset: (Number(page) - 1) * Number(size),
			limit: Number(size),
			raw: true,
			nest: true
		});

		return res.map(item => ({
			...item,
			symbol: item.asset.symbol,
			asset: undefined
		}));
	}

	async getQuotes() {
		const subQuery = `(
			SELECT id, ROW_NUMBER() OVER (PARTITION BY asset_id ORDER BY created_at DESC) as rn 
			FROM market_index
		)`;
	
		const data = await db.MarketIndex.findAll({
			attributes: ['price', 'created_at', 'asset_id'],
			include: [
				{
					model: db.Asset,
					as: 'asset',
					attributes: ['symbol'],
				}
			],
			where: {
				id: {
					[db.Sequelize.Op.in]: db.Sequelize.literal(`(
						SELECT t.id FROM ${subQuery} AS t WHERE t.rn = 1
					)`)
				}
			},
			raw: true,
			nest: true
		});
	
		return data.map(item => ({
			symbol: item.asset.symbol,
			price: item.price,
			created_at: item.created_at,
			asset_id: item.asset_id
		}));
	}
}

module.exports = new MarketIndexService()
