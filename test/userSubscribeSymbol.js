const User_subscribe_company = require('../modal/user_subscribe_company.js')

const stockSymbols = [
	'AAPL',
	'CRSP',
	'ISRG',
	'ABNB',
	'ADBE',
	'ADSK',
	'COIN',
	'CRM',
	'HUBS',
	'INTU',
	'IOT',
	'MELI',
	'NOW',
	'OKTA',
	'PATH',
	'SE',
	'SHOP',
	'U',
	'VEEV',
	'WDAY',

	'GOLD',
	'TECK',

	'IRDM',
	'LMT',

	'BB',
	'CRWD',
	'FFIV',
	'FTNT',
	'PANW',

	'AI',
	'GOOG',
	'MSFT',
	'NVDA',
	'PLTR',

	'AKAM',
	'AMZN',
	'ANET',
	'DDOG',
	'DOCN',
	'DT',
	'MDB',
	'NET',
	'ORCL',
	'SNOW',

	'MBLY',
	'TSLA',

	'AMAT',
	'AMD',
	'ASML',
	'AVGO',
	'CSCO',
	'LRCX',
	'MRVL',
	'MU',
	'ON',
	'QCOM',
	'SNPS',
	'SWKS',
	'TSM',
	'TXN',

	'ENPH',
	'FSLR',
	'SEDG',

	'MTDR',
	'OXY',
	'PXD',
	'XOM',

	'MA',
	'PYPL',
	'SQ',
	'V',

	'META',
	'SNAP',
	'TTD',
]

async function createMany(symbol) {
	try {
		const res = await User_subscribe_company.create({
			userId: 'lewis.lee',
			symbol,
		})
		if (res) console.log('寫入關聯表成功 ', symbol)
	} catch (e) {
		console.log(e)
		console.error('寫入關聯表失敗')
	}
}
for (let i = 0; i < stockSymbols.length; i++) {
	const symbol = stockSymbols[i]
	createMany(symbol)
}
