const express = require('express')
const router = express.Router()
const crud = require('../../crud/market_index')
const { verifyToken } = require('../../middleware/auth')
const { get } = require('lodash')

function calculateMean(values) {
	const sum = values.reduce((acc, val) => acc + val, 0)
	return sum / values.length
}

function calculateStdDev(values, mean) {
	const squaredDiffs = values.map((val) => (val - mean) ** 2)
	const avgSquaredDiff = calculateMean(squaredDiffs)
	return Math.sqrt(avgSquaredDiff)
}

router.get('/', verifyToken, async (req, res) => {
	const data = await crud.findAllMarketIndex()
	res.json(data)
})

router.get('/momentum', verifyToken, async (req, res) => {
	const data = await crud.findAndGroupByTime()

	const btcData = []
	const usoilData = []
	const dxyData = []

	data.forEach((item) => {
		switch (item.symbol) {
			case 'BTCUSD':
				btcData.push(item)
				break
			case 'USOIL':
				usoilData.push(item)
				break
			case 'DXY':
				dxyData.push(item)
				break
		}
	})

	const getStandardizedValue = (values, currentValue) => {
		const mean = calculateMean(values)
		const stdDev = calculateStdDev(values, mean)

		// 标准化当前值
		const standardizedValue = (currentValue - mean) / stdDev
		return parseFloat(standardizedValue.toFixed(2))
	}

	const btc_prices = btcData.map((vo) => vo.price)
	const btc_standardized = btcData.map((btcItem) => {
		const volume = getStandardizedValue(btc_prices, btcItem.price)
		return { ...btcItem, volume }
	})

	const dxy_prices = dxyData.map((vo) => vo.price)
	const dxy_standardized = dxyData.map((dxyItem) => {
		const volume = getStandardizedValue(dxy_prices, dxyItem.price)
		return { ...dxyItem, volume }
	})

	const usoil_prices = usoilData.map((vo) => vo.price)
	const usoil_standardized = usoilData.map((usoilItem) => {
		const volume = getStandardizedValue(usoil_prices, usoilItem.price)
		return { ...usoilItem, volume }
	})

	const consolidatedData = new Map()

	const addDataToMap = (data) => {
		data.forEach((item) => {
			const existingItem = consolidatedData.get(item.createdAt) || {
				createdAt: item.createdAt,
				btc: 0,
				usoil: 0,
				dxy: 0,
			}
			if (item.symbol === 'BTCUSD') {
				existingItem.btc = item.volume
			} else if (item.symbol === 'USOIL') {
				existingItem.usoil = item.volume
			} else if (item.symbol === 'DXY') {
				existingItem.dxy = item.volume
			}
			consolidatedData.set(item.createdAt, existingItem)
		})
	}

	addDataToMap(btc_standardized)
	addDataToMap(usoil_standardized)
	addDataToMap(dxy_standardized)

	const finalResult = Array.from(consolidatedData.values()).map((item) => {
		const { createdAt, btc, usoil, dxy } = item
		const volume = btc * 0.8 - 0.1 * dxy - 0.1 * usoil
		return { createdAt, volume: parseFloat(volume.toFixed(2)) }
	})

	res.json(finalResult)
})

module.exports = router
