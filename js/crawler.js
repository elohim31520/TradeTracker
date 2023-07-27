const cheerio = require('cheerio')
const Fetch = require('./fetch')
const { createDir, writeFile } = require("./file");
const { dbDir, requestUrl, stockSymbols, tcHeader } = require("./config");
const Schedule = require("./schedule");
const { getTimeNow, zhTimeToStandardTime } = require("./util");
const { sqlWrite, sqlCreateStatements, sqlCreateTechNews } = require("../crud/news");
const dayjs = require('dayjs')
const { get, isArray } = require('lodash')
const { sqlCreateCompany } = require("../crud/company");
const { default: axios } = require('axios');
const TechNews = require("../modal/techNews")

function parseHtmltoData(html, symbo) {
	const $ = cheerio.load(html);
	let rows = $('#news-table tr')
	let arr = []
	let date = null
	for (let i = 0; i < rows.length; i++) {
		const td = rows.eq(i).find('td')
		const atag = $(td).find("a")
		let time = td.eq(0).text(),
			title = atag.text(),
			publisher = $(td).find(".news-link-right").text(),
			webUrl = atag.attr('href')
		if (!/-/g.test(time)) time = `${date} ${time}`
		else date = time.split(" ")[0]
		arr.push({ releaseTime: time, title, publisher, webUrl, company: symbo })
	}
	return arr
};

var map = {
	"Market Cap": "Market_Cap",
	"Income": "Income",
	"Sales": "Sales",
	"Book/sh": "Book_sh",
	"Cash/sh": "Cash_sh",
	"Dividend": "Dividend",
	"Dividend %": "Dividend_percent",
	"Employees": "Employees",
	"Recom": "Recom",
	"P/E": "PE",
	"Forward P/E": "Forward_PE",
	"PEG": "PEG",
	"P/S": "PS",
	"P/B": "PB",
	"P/C": "PC",
	"P/FCF": "PFCF",
	"Quick Ratio": "Quick_Ratio",
	"Current Ratio": "Current_Ratio",
	"Debt/Eq": "DebtEq",
	"LT Debt/Eq": "LT_DebtEq",
	"EPS (ttm)": "EPS_ttm",
	"EPS next Y": "EPS_next_Y",
	"EPS next Q": "EPS_next_Q",
	"EPS this Y": "EPS_this_Y",
	"EPS next 5Y": "EPS_next_5Y",
	"EPS past 5Y": "EPS_past_5Y",
	"Sales past 5Y": "Sales_past_5Y",
	"Sales Q/Q": "Sales_QQ",
	"EPS Q/Q": "EPS_QQ",
	"Insider Own": "Insider_Own",
	"Insider Trans": "Insider_Trans",
	"Inst Own": "Inst_Own",
	"Inst Trans": "Inst_Trans",
	"ROA": "ROA",
	"ROE": "ROE",
	"ROI": "ROI",
	"Gross Margin": "Gross_Margin",
	"Oper. Margin": "Oper_Margin",
	"Profit Margin": "Profit_Margin",
	"Payout": "Payout",
	"Shs Outstand": "Shs_Outstand",
	"Shs Float": "Shs_Float",
	"Short Ratio": "Short_Ratio",
	"Target Price": "Target_Price",
	"RSI (14)": "RSI_14",
	"Rel Volume": "Rel_Volume",
	"Avg Volume": "Avg_Volume",
	"Volume": "Volume",
	"Beta": "Beta",
	"ATR": "ATR"
}


const mySchedule = new Schedule({ countdown: 60 * 60 })
mySchedule.interval(async () => {
	if (process.env.DEBUG_MODE) return
	console.log(`開始爬蟲，最後創建時間: ${mySchedule.lastTime}`)
	const now = dayjs().format('YYYY-MM-DD HH_mm_ss')
	const myPath = dbDir + now
	try {
		const scheduleSec = new Schedule({ countdown: 9 })
		const myFetch = new Fetch({ requestUrl, stockSymbols }),
			canGet = mySchedule.isTimeToGet(),
			hasTimeLimit = !mySchedule.isAfterTime({ gap: 24, gapUnit: "hour" })
		if (hasTimeLimit) {
			console.log("寫入有24小時限制");
			return
		}
		if (canGet) await createDir(myPath)
		scheduleSec.interval(async () => {
			try {
				const symbo = myFetch.getRequestSymbo()
				if (!symbo) {
					console.log(`no more symbo，爬蟲結束`)
					mySchedule.setLastTime()
					scheduleSec.removeInterval()
					console.log(myFetch.getAllErrorSymbo());
					return
				}
				const res = await myFetch.getHtml()
				const data = get(res, "data", {})

				let arr = parseHtmltoData(data, symbo),
					obj = parseHtmlStatementsTable(data)
				if (!isArray(arr) || !arr.length) {
					console.log("沒有fetch到資料");
					return
				}
				if (canGet) {
					console.log("寫入.json:", "  現在時間:", getTimeNow(), `寫入路徑: ${myPath}`);
					try {
						writeFile(`${myPath}/${symbo}.json`, JSON.stringify(arr, null, 4)) //24小時寫一次檔

						// 24小時寫一次statements
						obj.company = symbo
						console.log("寫入statememts");
						sqlCreateStatements(obj)
					} catch (error) {
						console.log(error);
						console.log("寫入資料夾失敗");
					}
				}
				sqlWrite(arr)

				// const companyName = pasreHTMLGetCompanyName(data)
				// sqlCreateCompany({symbol: symbo, name: companyName})

			} catch (e) {
				console.log(e);
				console.log("Fetch finviz失敗");
				myFetch.pushErrorSymobo()
				if (e.code == 999) {
					scheduleSec.removeInterval()
					return
				}
				myFetch.index++
			}
		})

	} catch (error) {
		console.log("爬蟲暫停");
	}
})

function parseHtmlStatementsTable(html) {
	const $ = cheerio.load(html);
	let keys = $('.snapshot-td2-cp'),
		values = $('.snapshot-td2'),
		obj = {}
	for (let i = 0; i < keys.length; i++) {
		const key = keys.eq(i).text(),
			val = values.eq(i).text(),
			alterKey = map[key.trim()]
		if (alterKey == "EPS next Y" && i > 24) alterKey = "EPS_grow_next_Y"
		if (!alterKey) continue
		obj[alterKey] = val
	}
	return obj
};

function pasreHTMLGetCompanyName(html) {
	const $ = cheerio.load(html);
	const name = $(".tab-link")
	const text = name.eq(1).text()
	return text
}

function extractDataFromTechNewsHtml(html) {
	const $ = cheerio.load(html)
	let arr = []
	$('table').each((index, element) => {
		let title = $(element).find('.maintitle h1.entry-title a').text()
		let web_url = $(element).find('.maintitle h1.entry-title a').attr('href')
		let release_time = $(element).find('.head:contains("發布日期")').next().text()
		let publisher = $(element).find('.head:contains("作者")').next().text()

		if (title) {
			title = title.trim()
			web_url = web_url.trim()
			release_time = zhTimeToStandardTime(release_time)
			arr.push({ title, web_url, release_time, publisher })
		}
	});

	return arr.reverse()
}

const techNewsSchedule = new Schedule({ countdown: 60 * 60 })
techNewsSchedule.interval(async () => {
	try {
		const res = await TechNews.findOne({
			attributes: ['createdAt'],
			order: [['createdAt', 'DESC']],
			limit: 1,
		})
		mySchedule.setLastTime(res.createdAt)

		const scheduleSec = new Schedule({ countdown: 10 }),
			now = dayjs()
		const startTime = now.set('hour', 17).set('minute', 0).set('second', 0)
		const endTime = now.set('hour', 18).set('minute', 0).set('second', 0)
		const isTimeToGet = now.isAfter(startTime) && now.isBefore(endTime)

		if (!isTimeToGet) {
			console.log("非獲取tech news 時間");
			return
		}
		let initialPage = 5,
			techUrl = `${process.env.TECHNEWS_URL}page/${initialPage}/`

		scheduleSec.interval(() => {
			if (initialPage <= 0) {
				scheduleSec.removeInterval()
				return
			}
			console.log("request url:", techUrl);
			axios.get(techUrl, { headers: tcHeader }).then(res => {
				const data = get(res, "data", {})
				let arr = extractDataFromTechNewsHtml(data)
				if (!isArray(arr) || !arr.length) {
					console.log("extract Nothing From Tech");
					return
				}
				sqlCreateTechNews(arr)
			}).catch(e => {
				console.log(e.message);
				console.log("axios get Wrong");
			})
			if (initialPage > 2) {
				initialPage -= 1
				techUrl = `${process.env.TECHNEWS_URL}page/${initialPage}/`
			} else if (initialPage <= 2) {
				initialPage -= 1
				techUrl = process.env.TECHNEWS_URL
			}
		})

	} catch (error) {
		console.log(error);
		console.log("techs爬蟲暫停");
	}
})

module.export = {
	parseHtmlStatementsTable
}