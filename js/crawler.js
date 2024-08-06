const cheerio = require('cheerio')
const { get, isArray } = require('lodash')
const { default: axios } = require('axios')
const CronJob = require('cron').CronJob
const dayjs = require('dayjs')
const iconv = require('iconv-lite')

const { FinzService, Sp500Service } = require('./fetch')
const { stockSymbols, symbos, tcHeader, marketIndexHeaders } = require('./config')

const Schedule = require('./schedule')
const { zhTimeToStandardTime } = require('./util')
const { sqlWrite, sqlCreateStatements, sqlCreateTechNews, sqlCompanyStatements } = require('../crud/news')
const News = require('../models/news')
const logger = require('../logger')
const util = require('./util')
const miCrud = require('../crud/market_index')
const marketIndexService = require('../services/marketIndexService')

const db = require('../models')

function createCronJob({ schedule, mission }) {
	const job = new CronJob(schedule, mission, null, true, 'Asia/Taipei')
	return job
}

function parseFinzHtml(html, symbo) {
	const $ = cheerio.load(html)
	const monthList = util.getMonthList()
	let rows = $('#news-table tr')
	let arr = [],
		date = ''

	for (let i = 0; i < rows.length; i++) {
		const td = rows.eq(i).find('td')
		const atag = $(td).find('a')
		let time = td.eq(0).text() || '',
			title = atag.text(),
			publisher = $(td).find('.news-link-right').text(),
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
}

var map = {
	'Market Cap': 'Market_Cap',
	'Income': 'Income',
	'Sales': 'Sales',
	'Book/sh': 'Book_sh',
	'Cash/sh': 'Cash_sh',
	'Dividend': 'Dividend',
	'Dividend %': 'Dividend_percent',
	'Employees': 'Employees',
	'Recom': 'Recom',
	'P/E': 'PE',
	'Forward P/E': 'Forward_PE',
	'PEG': 'PEG',
	'P/S': 'PS',
	'P/B': 'PB',
	'P/C': 'PC',
	'P/FCF': 'PFCF',
	'Quick Ratio': 'Quick_Ratio',
	'Current Ratio': 'Current_Ratio',
	'Debt/Eq': 'DebtEq',
	'LT Debt/Eq': 'LT_DebtEq',
	'EPS (ttm)': 'EPS_ttm',
	'EPS next Y': 'EPS_next_Y',
	'EPS next Q': 'EPS_next_Q',
	'EPS this Y': 'EPS_this_Y',
	'EPS next 5Y': 'EPS_next_5Y',
	'EPS past 5Y': 'EPS_past_5Y',
	'Sales past 5Y': 'Sales_past_5Y',
	'Sales Q/Q': 'Sales_QQ',
	'EPS Q/Q': 'EPS_QQ',
	'Insider Own': 'Insider_Own',
	'Insider Trans': 'Insider_Trans',
	'Inst Own': 'Inst_Own',
	'Inst Trans': 'Inst_Trans',
	'ROA': 'ROA',
	'ROE': 'ROE',
	'ROI': 'ROI',
	'Gross Margin': 'Gross_Margin',
	'Oper. Margin': 'Oper_Margin',
	'Profit Margin': 'Profit_Margin',
	'Payout': 'Payout',
	'Shs Outstand': 'Shs_Outstand',
	'Shs Float': 'Shs_Float',
	'Short Ratio': 'Short_Ratio',
	'Target Price': 'Target_Price',
	'RSI (14)': 'RSI_14',
	'Rel Volume': 'Rel_Volume',
	'Avg Volume': 'Avg_Volume',
	'Volume': 'Volume',
	'Beta': 'Beta',
	'ATR': 'ATR',
}

async function fetchFinzNews() {
	if (process.env.DEBUG_MODE) return
	if (process.env.STOP_FETCH_FINZ) return

	const res = await News.findOne({
		attributes: ['createdAt'],
		order: [['createdAt', 'DESC']],
		limit: 1,
	})
	const lastCreatedTime = res.createdAt

	try {
		const scheduleSec = new Schedule({ countdown: 9.5 })
		const myFetch = new FinzService({ requestUrl: process.env.FINZ_URL, stockSymbols })
		const canGet = dayjs().isAfter(dayjs(lastCreatedTime).add(24, 'hour'))
		if (!canGet) return

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
				const data = get(res, 'data', {})

				let arr = parseFinzHtml(data, symbo),
					obj = parseHtmlStatementsTable(data)
				if (!isArray(arr) || !arr.length) {
					logger.error('extract Nothing From Finz, HTML解析錯誤？')
					return
				}
				obj.company = symbo
				sqlCreateStatements(obj)
				sqlWrite(arr)

				// const companyName = pasreHTMLGetCompanyName(data)
				// sqlCreateCompany({symbol: symbo, name: companyName})
			} catch (e) {
				let httpStatus
				if (e.response) httpStatus = e.response.status
				logger.error(`Fetch finviz失敗: ${e.message}`)
				myFetch.pushErrorSymbo()
				if (e.code == 999 || httpStatus == 403) {
					scheduleSec.removeInterval()
					logger.info(`---Request End---`)
					return
				}
				myFetch.index++
			}
		})
	} catch (e) {
		logger.error(e.message)
	}
}

function parseHtmlStatementsTable(html) {
	const $ = cheerio.load(html)
	let keys = $('.snapshot-td2-cp'),
		values = $('.snapshot-td2'),
		obj = {}
	for (let i = 0; i < keys.length; i++) {
		const key = keys.eq(i).text(),
			val = values.eq(i).text(),
			alterKey = map[key.trim()]
		if (alterKey == 'EPS next Y' && i > 24) alterKey = 'EPS_grow_next_Y'
		if (!alterKey) continue
		obj[alterKey] = val
	}
	return obj
}

function pasreHTMLGetCompanyName(html) {
	const $ = cheerio.load(html)
	const name = $('.tab-link')
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
	})

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
			logger.info('---request Technews End---')
			return
		}
		axios
			.get(techUrl, { headers: tcHeader })
			.then((res) => {
				const data = get(res, 'data', {})
				let arr = extractDataFromTechNewsHtml(data)
				if (!isArray(arr) || !arr.length) {
					logger.error('extract Nothing From Tech, HTML解析錯誤？')
					return
				}
				sqlCreateTechNews(arr)
			})
			.catch((e) => {
				logger.error(e.message)
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

async function fetchStatements() {
	if (process.env.DEBUG_MODE) return

	const res = await db.company_statements.findOne({
		attributes: ['createdAt'],
		order: [['createdAt', 'DESC']],
		limit: 1,
	})
	const lastCreatedTime = res.createdAt

	try {
		const scheduleSec = new Schedule({ countdown: 8 })
		const myFetch = new Sp500Service({ requestUrl: process.env.SP500_URL, stockSymbols: symbos })

		const canGet = dayjs().isAfter(dayjs(lastCreatedTime).add(24, 'hour'))
		if (!canGet) return

		scheduleSec.interval(async () => {
			try {
				const symbo = myFetch.getRequestSymbo()
				if (!symbo) {
					scheduleSec.removeInterval()

					logger.info(`no more symbo，---Request End---`)
					logger.warn(`failed symbol: ${myFetch.getAllErrorSymbo()}`)
					return
				}
				const htmlContent = await myFetch.getHtml()
				const $ = cheerio.load(htmlContent)

				const targetTable = $('.row .col-lg-7 .table')
				const tdObject = {}

				targetTable.find('tbody tr').each((index, element) => {
					const tds = $(element).find('td')

					const key1 = $(tds[0]).text().trim()
					const value1 = $(tds[1]).text().trim()
					const key2 = $(tds[2]).text().trim()
					const value2 = $(tds[3]).text().trim()

					if (key1) tdObject[key1] = value1
					if (key2) tdObject[key2] = value2
				})
				const keymap = {
					'P/E (Trailing)': 'PE_Trailing',
					'P/E (Forward)': 'PE_Forward',
					'EPS (Trailing)': 'EPS_Trailing',
					'Prev Close': 'price',
					'EPS (Forward)': 'EPS_Forward',
					'Volume': 'volume',
					'Market Cap': 'marketCap',
				}
				const params = {}

				for (const key in tdObject) {
					if (keymap.hasOwnProperty(key)) {
						let newkey = keymap[key]
						let value = tdObject[key]
						if (newkey == 'marketCap') {
							params[newkey] = value
						} else {
							//資料庫的值要是decimal
							params[newkey] = +value
						}
					}
				}
				params.symbo = symbo
				sqlCompanyStatements(params)
			} catch (e) {
				let httpStatus
				if (e.response) httpStatus = e.response.status
				logger.error(`Fetch sp500 statements失敗: ${e.message}`)
				myFetch.pushErrorSymbo()
				if (e.code == 999 || httpStatus == 403) {
					scheduleSec.removeInterval()
					logger.info(`---Request End---`)
					return
				}
				myFetch.index++
			}
		})
	} catch (e) {
		logger.error(e.message)
	}
}

async function fetchMarketIndex() {
	if (process.env.DEBUG_MODE) return

	const url = process.env.MARKET_URL
	try {
		const response = await axios.get(url, { headers: marketIndexHeaders })
		const htmlContent = iconv.decode(response.data, 'utf-8')
		const $ = cheerio.load(htmlContent)

		const getParams = (symbol) => {
			let row
			if (symbol == 'USOIL') row = $(`tr[data-symbol="CL1:COM"]`)
			else row = $(`tr[data-symbol="${symbol}:CUR"]`)
			const val = row.find('td#p').text().trim()
			const chValue = row.find('td#pch').text().trim().replace('%', '')
			console.log(`${symbol}的值: `, +val, '%Chg: ', chValue)
			return {
				symbol,
				price: +val,
				change: +chValue,
			}
		}

		const symbols = ['BTCUSD', 'DXY', 'USOIL']
		for (const symbol of symbols) {
			const param = getParams(symbol)
			const lastOne = await marketIndexService.getLstOne(symbol)
			const lastPrice = get(lastOne, 'price', null)

			if (lastPrice !== null) {
				param.volatility = +((param.price - lastPrice) / lastPrice) * 100
			}

			await marketIndexService.create(param)
		}
	} catch (err) {
		logger.error(err.message)
	}
}

createCronJob({
	schedule: process.env.CRONJOB_TECHNEWS,
	mission: fetchTnews,
})

createCronJob({
	schedule: process.env.CRONJOB_SP500,
	mission: fetchStatements,
})

createCronJob({
	schedule: process.env.CRONJOB_MARKET_INDEX,
	mission: fetchMarketIndex,
})

module.export = {
	parseHtmlStatementsTable,
}
