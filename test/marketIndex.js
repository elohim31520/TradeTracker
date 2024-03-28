function scaleFunction(btc, dxy, w1, w2) {
    let sqBtc = btc ** 2
    let sqDxy = dxy ** 2

    if (btc < 0) sqBtc = -sqBtc
	if (dxy < 0) sqDxy = -sqDxy

    let weightedBtc = sqBtc * w1
    let weightedDxy = sqDxy * w2

    let scaledValue = weightedBtc - weightedDxy

    return scaledValue
}

let testCase = [
    [20, 10], [20, 5], [20, 0], [20, -5], [20, -10],
    [15, 10], [15, 5], [15, 0], [15, -5], [15, -10],
    [10, 10], [10, 5], [10, 0], [10, -5], [10, -10],
    [5, 10], [5, 5], [5, 0], [5, -5], [5, -10],
    [0, 10], [0, 5], [0, 0], [0, -5], [0, -10],
    [-5, 10], [-5, 5], [-5, 0], [-5, -5], [-5, -10],
    [-10, 10], [-10, 5], [-10, 0], [-10, -5], [-10, -10],
    [-15, 10], [-15, 5], [-15, 0], [-15, -5], [-15, -10],
    [-20, 10], [-20, 5], [-20, 0], [-20, -5], [-20, -10]
];

const w1 = 0.81
const w2 = 0.19

let res = []
let max = 0
let min = 0
testCase.forEach(arr => {
    let [btc, dxy] = arr
    const scaledResult = scaleFunction(btc, dxy, w1, w2)
	max = Math.max(max, scaledResult)
	min = Math.min(min, scaledResult)
	res.push(scaledResult)
})

res.forEach((num, i) => {
	let ratio = 200 / (max - min)
	let answ = ((num - min) * ratio) - 100
	console.log(testCase[i], answ);
})