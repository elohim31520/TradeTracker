const express = require('express')
const router = express.Router()
const crud = require('../../crud/market_index')
const { verifyToken } = require('../../middleware/auth')
const { get } = require('lodash')

function computeMomentum(btc, dxy) {
	const w1 = 0.8
	const w2 = 0.2
	let sqBtc = btc ** 2
	let sqDxy = dxy ** 2

	if (btc < 0) sqBtc = -sqBtc
	if (dxy < 0) sqDxy = -sqDxy

	let weightedBtc = sqBtc * w1
	let weightedDxy = sqDxy * w2

	let scaledValue = weightedBtc - weightedDxy

	return scaledValue
}

// 计算均值和标准差的函数
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
	const groupedData = data.reduce((acc, obj) => {
		const existingGroup = acc.find((group) => group[0].createdAt === obj.createdAt)

		if (existingGroup) {
			existingGroup.push(obj)
		} else {
			acc.push([obj])
		}
		return acc
	}, [])

	const btcData = []
	const usoilData = []
	const dxyData = []

	groupedData.forEach((subArray) => {
		subArray.forEach((item) => {
			switch (item.symbol) {
				case 'BTCUSD':
					btcData.push(item.price)
					break
				case 'USOIL':
					usoilData.push(item.price)
					break
				case 'DXY':
					dxyData.push(item.price)
					break
			}
		})
	})

	const getStandardizedValue = (values, currentValue) => {
		const mean = calculateMean(values)
		const stdDev = calculateStdDev(values, mean)

		// 标准化当前值
		const standardizedValue = (currentValue - mean) / stdDev
		return parseFloat(standardizedValue.toFixed(2))
	}

	const btc_standardized = btcData.map(price => getStandardizedValue(btcData, price))
	// const usoil_standardized = usoilData.map(price => getStandardizedValue(usoilData, price))
	// const dxy_standardized= dxyData.map(price => getStandardizedValue(dxyData, price))

	res.json(btc_standardized)
})

module.exports = router
