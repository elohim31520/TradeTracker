const api = require("./records")

const total_position = 21000 + 17000
console.log("總倉：", total_position);

async function mathStategy(company, strategy, target) {
	try {
		let data
		const res = await api.getRecords("http://localhost:1234/records/holding/lewis.lee?company=" + company)
		data = res.data.find(vo => vo.company == company)
		console.log(data)

		let totalShare = +data.share
		let avg = +data.price
		let total = +data.total
		strategy.forEach(vo => {
			let share = +vo[0]
			let price = +vo[1]

			totalShare += +share
			total += +price

			avg = total / totalShare

			console.log(`買入${data.company}, ${share}股 -- 價位${price}`);
			console.log(`均價：${avg}, 總倉：${total}, 總股數：${totalShare}`);
			console.log("\n");
		})

		console.log(`行使後 ${company} 佔據總倉位的${getPercentage(total, total_position)}%`);
		console.log(`距離目標買進：${target} 佔總倉${getPercentage(target, total_position)}%, 還差：${target - total}`);
	} catch (e) {
		console.log(e);
	}
}

function getPercentage(numerator, denominator) {
	return ((numerator / denominator) * 100).toFixed(2)
}

function gspa(share, price) {
	return [share, share * price]
}

mathStategy("TSLA", [
	gspa(5, 200),
	gspa(5, 180),
	gspa(5, 160),
	gspa(5, 170),
], 4000)

// mathStategy("GOOG", [
// 	[1, 115],
// 	[1, 115],
// 	[1, 110],
// 	[1, 110],
// 	[1, 110]
// ], 4000)

// mathStategy("ENPH", [
// 	[1, 130],
// 	[1, 130],
// 	[1, 120],
// 	[1, 120],
// 	[1, 120]
// ], 3000)

// mathStategy("FTNT", [
// 	gspa(6, 58),
// ], 3000)