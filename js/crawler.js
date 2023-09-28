const cheerio = require('cheerio')
const { get, isArray } = require('lodash')
const { default: axios } = require('axios')
const CronJob = require('cron').CronJob

const Fetch = require('./fetch')
const { requestUrl, stockSymbols, tcHeader } = require("./config");
const Schedule = require("./schedule");
const { zhTimeToStandardTime } = require("./util");
const { sqlWrite, sqlCreateStatements, sqlCreateTechNews } = require("../crud/news")
const News = require("../modal/news")
const logger = require("../logger")
const util = require("./util")

function createCronJob(schedule, mission) {
	const job = new CronJob(
		schedule,
		mission,
		null,
		true,
		'Asia/Taipei'
	)
	return job
}

function parseFinzHtml(html, symbo) {
	const $ = cheerio.load(html);
	const monthList = util.getMonthList()
	let rows = $('#news-table tr')
	let arr = [],
		date = ''

	for (let i = 0; i < rows.length; i++) {
		const td = rows.eq(i).find('td')
		const atag = $(td).find("a")
		let time = td.eq(0).text() || "",
			title = atag.text(),
			publisher = $(td).find(".news-link-right").text(),
			webUrl = atag.attr('href')

		time = time.trim()
		const monthAbbreviation = time.substring(0, 3)

		if (monthList.includes(monthAbbreviation)) {
			date = get(time.split(' '), '[0]', '')
		} else {
			time = `${date} ${time}`
		}

		publisher = publisher.trim()
		webUrl = webUrl.trim()
		title = title.trim()

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
	if (process.env.STOP_FETCH_FINZ) return

	const res = await News.findOne({
		attributes: ['createdAt'],
		order: [['createdAt', 'DESC']],
		limit: 1,
	})
	mySchedule.setLastTime(res.createdAt)

	logger.info(`go request finz，最後一筆時間: ${mySchedule.lastTime}`)

	try {
		const scheduleSec = new Schedule({ countdown: 9 })
		const myFetch = new Fetch({ requestUrl, stockSymbols })
		const canGet = mySchedule.isTimeToGet()
		const hasTimeLimit = !mySchedule.isAfterTime({ gap: 24, gapUnit: "hour" })

		if (hasTimeLimit) {
			logger.warn('finz 寫入有24小時限制')
			return
		}

		scheduleSec.interval(async () => {
			try {
				const symbo = myFetch.getRequestSymbo()
				if (!symbo) {
					scheduleSec.removeInterval()

					logger.info(`no more symbo，---Request End---`)
					logger.warn(`failed symbol: ${myFetch.getAllErrorSymbo()}`)
					return
				}
				const res = await myFetch.getHtml()
				const data = get(res, "data", {})

				let arr = parseFinzHtml(data, symbo),
					obj = parseHtmlStatementsTable(data)
				if (!isArray(arr) || !arr.length) {
					logger.error("extract Nothing From Finz, HTML解析錯誤？")
					return
				}
				if (canGet) {
					try {
						obj.company = symbo
						sqlCreateStatements(obj)
					} catch (e) {
						logger.error(`寫入資料夾失敗: ${e.message}`)
					}
				}
				sqlWrite(arr)

				// const companyName = pasreHTMLGetCompanyName(data)
				// sqlCreateCompany({symbol: symbo, name: companyName})

			} catch (e) {
				const httpStatus = e.response.status
				logger.error(`Fetch finviz失敗: ${e.message}`)
				myFetch.pushErrorSymobo()
				if (e.code == 999 || httpStatus == 403) {
					scheduleSec.removeInterval()
					logger.info(`---Request End---`);
					if (httpStatus == 403) {
						logger.warn('fetch finviz 403 Forbidden')
					}
					return
				}
				myFetch.index++
			}
		})

	} catch (e) {
		logger.error(e.message);
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

function fetchTnews() {
	if (process.env.DEBUG_MODE) return
	if (process.env.STOP_FETCH_TNEWS) return
	const scheduleSec = new Schedule({ countdown: 10 })
	let initialPage = 5
	let techUrl = `${process.env.TECHNEWS_URL}page/${initialPage}/`

	scheduleSec.interval(() => {
		if (initialPage <= 0) {
			scheduleSec.removeInterval()
			logger.info("---request Technews End---")
			return
		}
		axios.get(techUrl, { headers: tcHeader }).then(res => {
			const data = get(res, "data", {})
			let arr = extractDataFromTechNewsHtml(data)
			if (!isArray(arr) || !arr.length) {
				logger.error("extract Nothing From Tech, HTML解析錯誤？")
				return
			}
			sqlCreateTechNews(arr)
		}).catch(e => {
			logger.error(e.message);
		})
		if (initialPage > 2) {
			initialPage -= 1
			techUrl = `${process.env.TECHNEWS_URL}page/${initialPage}/`
		} else if (initialPage <= 2) {
			initialPage -= 1
			techUrl = process.env.TECHNEWS_URL
		}
	})
}

createCronJob('0 10 * * *', () => {
	fetchTnews()
})


createCronJob('0 17 * * *', () => {
	fetchTnews()
})


module.export = {
	parseHtmlStatementsTable
}