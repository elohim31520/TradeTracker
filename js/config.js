const path = require("path");
const fs = require('fs');

const dbDir = path.join(__dirname, `../DB/`)

function getStockSymbol() {
	let file = path.join(__dirname, `../symbol.json`)
	let obj = JSON.parse(fs.readFileSync(file));
	let symbols = obj.symbols
	let arr = []
	symbols.forEach(vo => {
		let sym = vo.split(":")
		if (sym.length == 1) arr.push(sym[0])
		else arr.push(sym[1])
	});
	return arr
}

/**
 * 配置
 */

const stockSymbols = getStockSymbol()

const tcHeader = {
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
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
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
};

const fzHeader = {}

const successResponse = { code: 1, message: 'Success' }

const symbos = [
	"AAPL",
	"PATH",
	"ADBE",
	"ANET",
	"NOW",
	"SHOP",
	"CRM",
	"HUBS",
	"SNPS",
	"CRWD",
	"PANW",
	"FTNT",
	"NVDA",
	"GOOG",
	"MSFT",
	"PLTR",
	"MDB",
	"AMZN",
	"DDOG",
	"ORCL",
	"NET",
	"SNOW",
	"TSLA",
	"AMD",
	"MRVL",
	"INTC",
	"LRCX",
	"MU",
	"QCOM",
	"ASML",
	"AMAT",
	"ON",
	"AVGO",
	"FSLR",
	"TTD",
	"META",
]

module.exports = {
	dbDir,
	stockSymbols,
	tcHeader,
	fzHeader,
	successResponse,
	symbos
}