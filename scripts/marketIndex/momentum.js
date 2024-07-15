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

let groupedData = [
	[20, 10],
	[20, 5],
	[20, 0],
	[20, -5],
	[20, -10],
	[15, 10],
	[15, 5],
	[15, 0],
	[15, -5],
	[15, -10],
	[10, 10],
	[10, 5],
	[10, 0],
	[10, -5],
	[10, -10],
	[5, 10],
	[5, 5],
	[5, 0],
	[5, -5],
	[5, -10],
	[0, 10],
	[0, 5],
	[0, 0],
	[0, -5],
	[0, -10],
	[-5, 10],
	[-5, 5],
	[-5, 0],
	[-5, -5],
	[-5, -10],
	[-10, 10],
	[-10, 5],
	[-10, 0],
	[-10, -5],
	[-10, -10],
	[-15, 10],
	[-15, 5],
	[-15, 0],
	[-15, -5],
	[-15, -10],
	[-20, 10],
	[-20, 5],
	[-20, 0],
	[-20, -5],
	[-20, -10],
	[0.64, 0.11],
	[1, 0.1],
	[-0.15, 0.11],
	[-0.26, 0.14],
	[0.29, 0.02],
	[0.78, 0.04],
	[0.48, 0.01],
	[1.15, -0.01],
	[1.89, 0.05],
	[2.29, 0.23],
	[2.49, 0.35],
	[-0.06, 0.05],
]

const momentuns = groupedData
	.map((group) => {
		const btcChange = group[0]
		const dxyChange = group[1]

		const momentumValue = computeMomentum(btcChange, dxyChange)
		return momentumValue
	})
	.filter((v) => v !== undefined)

const max = Math.max(...momentuns)
const min = Math.min(...momentuns)
let ratio = 200 / (max - min)

const scaledMomentuns = momentuns.map((num) => {
	let scaledValue = (num - min) * ratio - 100
	return scaledValue
})

console.log(scaledMomentuns);