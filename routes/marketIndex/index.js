const express = require('express')
const router = express.Router()
const crud = require('../../crud/market_index')
const { verifyToken } = require('../../js/middleware')
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

	const momentuns = groupedData
		.map((group) => {
			const btcObj = group.find((vo) => vo.symbol == 'BTCUSD')
			const dxyObj = group.find((vo) => vo.symbol == 'DXY')

			const btcChange = get(btcObj, 'change', null)
			const dxyChange = get(dxyObj, 'change', null)

			const momentumValue = computeMomentum(btcChange, dxyChange)
			return momentumValue
		})
		.filter((v) => v !== undefined)

	const max = Math.max(...momentuns)
	const min = Math.min(...momentuns)
	let ratio = 200 / (max * 10 - min * 10)

	const scaledMomentuns = momentuns.map(num => {
		let scaledValue = (num - min * 10) * ratio - 100
		return scaledValue
	})

	res.json(scaledMomentuns)
})

module.exports = router
