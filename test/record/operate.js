const recordsModel = require("./records")

// recordsModel.add(
// 	[{
// 		userId: 'lewis.lee',
// 		share: 1,
// 		price: 63.14,
// 		company: "NET",
// 		total: 63.14,
// 		open_time: '2023-08-30'
// 	},
// 	{
// 		userId: 'lewis.lee',
// 		share: 1,
// 		price: 61.35,
// 		company: "FTNT",
// 		total: 61.35,
// 		open_time: '2023-08-30'
// 	}],
// 	"buy"
// )

//purchases
//sales
//holdings

recordsModel.add(
	[{
		userId: 'lewis.lee',
		share: 1,
		price: 12,
		company: "TEST",
		open_time: '2023-11-03'
	}],
	"sales"
)

// recordsModel.update({
// 	id: 48,
// 	data: { share: 6, price: 66.66, total: 400 },
// 	model: 'holdings',
// 	query: '?userId=lewis.lee&company=TEST'
// })

// recordsModel.del({
// 	id: 50,
// 	model: 'holdings',
// 	query: '?userId=lewis.lee&company=TEST'
// })

// recordsModel.get("http://localhost:1234/records/buy/lewis.lee")