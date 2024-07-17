const path = require('path')
const fs = require('fs')

const dbDir = path.join(__dirname, `../DB/`)

function getStockSymbol() {
	let file = path.join(__dirname, `../symbol.json`)
	let obj = JSON.parse(fs.readFileSync(file))
	let symbols = obj.symbols
	let arr = []
	symbols.forEach((vo) => {
		let sym = vo.split(':')
		if (sym.length == 1) arr.push(sym[0])
		else arr.push(sym[1])
	})
	return arr
}

/**
 * 配置
 */

const stockSymbols = getStockSymbol()

const tcHeader = {
	'Accept':
		'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
	'Accept-Encoding': 'gzip, deflate, br',
	'Accept-Language': 'zh-TW,zh;q=0.9',
	'Cache-Control': 'max-age=0',
	'Connection': 'keep-alive',
	'Host': 'technews.tw',
	'Referer': 'https://technews.tw/',
	'Sec-Ch-Ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
	'Sec-Ch-Ua-Mobile': '?0',
	'Sec-Ch-Ua-Platform': '"macOS"',
	'Sec-Fetch-Dest': 'document',
	'Sec-Fetch-Mode': 'navigate',
	'Sec-Fetch-Site': 'same-origin',
	'Sec-Fetch-User': '?1',
	'Upgrade-Insecure-Requests': '1',
	'User-Agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
}

const fzHeader = {}

const successResponse = { code: 1, message: 'Success' }

const symbos = [
	'AAPL',
	'PATH',
	'ADBE',
	'ANET',
	'NOW',
	'SHOP',
	'CRM',
	'HUBS',
	'SNPS',
	'CRWD',
	'PANW',
	'FTNT',
	'NVDA',
	'GOOG',
	'MSFT',
	'PLTR',
	'MDB',
	'AMZN',
	'DDOG',
	'ORCL',
	'NET',
	'SNOW',
	'TSLA',
	'AMD',
	'MRVL',
	'INTC',
	'LRCX',
	'MU',
	'QCOM',
	'ASML',
	'AMAT',
	'ON',
	'AVGO',
	'FSLR',
	'TTD',
	'META',
	'TSM'
]

const marketIndexHeaders = {
	'authority': 'tradingeconomics.com',
	'method': 'GET',
	'path': '/united-states/currency',
	'scheme': 'https',
	'Accept':
		'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
	'Accept-Encoding': 'gzip, deflate, br',
	'Accept-Language': 'zh-TW,zh;q=0.9',
	'Cache-Control': 'no-cache',
	'Cookie':
		'ASP.NET_SessionId=3pkm13cxzcvom24hjgb4opyn; _ga=GA1.1.998540396.1711356147; IsDarkMode=true; __gads=ID=fbb643e73611a806:T=1711427341:RT=1711434236:S=ALNI_MZ41Ved140LWOzcx4jk60cEMc1uxg; __gpi=UID=00000d64977dc871:T=1711427341:RT=1711434236:S=ALNI_MYsN5ZO8Lb2T88p2goYFapSZyulCw; __eoi=ID=3692487b0ae11a1a:T=1711427341:RT=1711434236:S=AA-AfjZhPgngiFcyHA6BzHAeZt-W',
	'Pragma': 'no-cache',
	'Referer': 'https://tradingeconomics.com/stream?c=united+states',
	'Sec-Fetch-Dest': 'document',
	'Sec-Fetch-Mode': 'navigate',
	'Sec-Fetch-Site': 'same-origin',
	'Sec-Fetch-User': '?1',
	'Upgrade-Insecure-Requests': '1',
	'User-Agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

module.exports = {
	dbDir,
	stockSymbols,
	tcHeader,
	fzHeader,
	successResponse,
	symbos,
	marketIndexHeaders,
}
