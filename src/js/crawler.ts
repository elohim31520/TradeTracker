import axios, { AxiosResponse } from 'axios'
import iconv from 'iconv-lite'
import cheerio from 'cheerio'
import { get, isArray } from 'lodash'
const https = require('https')
const dayjs = require('dayjs')

const { Sp500Fetcher } = require('./financialDataFetcher')
const { SYMBOLS, tcHeader, marketIndexHeaders, CM_Headers } = require('./config')

import Schedule from './schedule'

const logger = require('../logger')
const util = require('./util')
const marketIndexService = require('../services/marketIndexService')

const db = require('../../models')
const TechNews = require('../../models/techNews')

interface Article {
	title: string
	web_url: string
	release_time: string
	publisher: string
}

function extractDataFromTechNewsHtml(html: string): Article[] {
	const $ = cheerio.load(html)
	const arr: Article[] = []

	$('table').each((index, element) => {
		let title = $(element).find('.maintitle h1.entry-title a').text()
		let web_url = $(element).find('.maintitle h1.entry-title a').attr('href') || ''
		let release_time = $(element).find('.head:contains("發布日期")').next().text()
		let publisher = $(element).find('.head:contains("作者")').next().text()

		if (title) {
			title = title.trim()
			web_url = web_url.trim()
			release_time = util.zhTimeToStandardTime(release_time)
			arr.push({ title, web_url, release_time, publisher })
		}
	})

	return arr.reverse()
}

function fetchTnews(): void {
	const scheduleSec = new Schedule({ countdown: 10 })
	let initialPage = 5
	let techUrl: string = `${process.env.TECHNEWS_URL}page/${initialPage}/`

	scheduleSec.startInterval(async () => {
		if (initialPage <= 0) {
			scheduleSec.removeInterval()
			logger.info('---request Technews End---')
			return
		}

		try {
			const res = await axios.get(techUrl, { headers: tcHeader })
			const data = get(res, 'data', {})
			let arr = extractDataFromTechNewsHtml(data)

			if (!isArray(arr) || !arr.length) {
				logger.error('extract Nothing From Tech, HTML解析錯誤？')
				return
			}

			for (const vo of arr) {
				try {
					const parsedDate = dayjs.utc(vo.release_time, 'YYYY-MM-DD HH:mm').toDate()
					const release_time = dayjs(parsedDate).toISOString()

					await db.tech_investment_news.create({ ...vo, release_time })
					await TechNews.create(vo)
				} catch (e: any) {
					console.warn((e as Error).message)
				}
			}
		} catch (e: any) {
			console.error((e as Error).message)
		}

		if (initialPage > 2) {
			initialPage -= 1
			techUrl = `${process.env.TECHNEWS_URL}page/${initialPage}/`
		} else if (initialPage <= 2) {
			initialPage -= 1
			techUrl = process.env.TECHNEWS_URL || ''
		}
	})
}

interface StatementParams {
	symbo: string
	PE_Trailing?: number
	PE_Forward?: number
	EPS_Trailing?: number
	price?: number
	EPS_Forward?: number
	volume?: number
	marketCap?: string
	[key: string]: string | number | undefined
}

async function fetchStatements(): Promise<void> {
	try {
		const res = await db.company_statements.findOne({
			attributes: ['createdAt'],
			order: [['createdAt', 'DESC']],
			limit: 1,
		})

		if (!res) {
			logger.warn('No company statements found.')
			return
		}

		const lastCreatedTime = res.createdAt
		const scheduleSec = new Schedule({ countdown: 8 })
		const symbols = Array.from(SYMBOLS)
		const myFetch = new Sp500Fetcher({ requestUrl: process.env.SP500_URL, stockSymbols: symbols })

		const canGet = dayjs().isAfter(dayjs(lastCreatedTime).add(24, 'hour'))
		if (!canGet) return

		scheduleSec.startInterval(async () => {
			try {
				const symbo = myFetch.getCurrentSymbol()
				if (!symbo) {
					scheduleSec.removeInterval()

					logger.info(`no more symbo，---Request End---`)
					logger.warn(`failed symbol: ${myFetch.getAllErrorSymbols()}`)
					return
				}
				const htmlContent = await myFetch.fetchHtml()
				const $ = cheerio.load(htmlContent)

				const targetTable = $('.row .col-lg-7 .table')
				const tdObject: { [key: string]: string } = {}

				targetTable.find('tbody tr').each((index, element) => {
					const tds = $(element).find('td')

					const key1 = $(tds[0]).text().trim()
					const value1 = $(tds[1]).text().trim()
					const key2 = $(tds[2]).text().trim()
					const value2 = $(tds[3]).text().trim()

					if (key1) tdObject[key1] = value1
					if (key2) tdObject[key2] = value2
				})
				const keymap: { [key: string]: keyof StatementParams } = {
					'P/E (Trailing)': 'PE_Trailing',
					'P/E (Forward)': 'PE_Forward',
					'EPS (Trailing)': 'EPS_Trailing',
					'Prev Close': 'price',
					'EPS (Forward)': 'EPS_Forward',
					'Volume': 'volume',
					'Market Cap': 'marketCap',
				}
				const params: StatementParams = { symbo }

				for (const key in tdObject) {
					if (keymap.hasOwnProperty(key)) {
						const newkey = keymap[key]
						const value = tdObject[key]
						// 检查 value 是否存在
						if (value !== undefined && value !== '') {
							// 根据 newkey 类型进行转换
							if (newkey === 'marketCap') {
								params[newkey] = value // marketCap 是字符串
							} else {
								// 将值转换为数字并检查是否有效
								const numericValue = parseFloat(value)
								if (!isNaN(numericValue)) {
									params[newkey as string] = numericValue
								}
							}
						}
					}
				}
				db.company_statements.create(params)
			} catch (e: any) {
				let httpStatus: number | undefined
				if (e.response) httpStatus = e.response.status
				logger.error(`Fetch sp500 statements失敗: ${e.message}`)
				myFetch.addErrorSymbol()
				if (e.code == 999 || httpStatus == 403) {
					scheduleSec.removeInterval()
					logger.info(`---Request End---`)
					return
				}
				myFetch.index++
			}
		})
	} catch (e: any) {
		logger.error((e as Error).message)
	}
}

interface MarketIndexParams {
	symbol: string
	price: number
	change: number
	volatility?: number
}

async function fetchMarketIndex(): Promise<void> {
	const url = process.env.MARKET_URL
	const USOIL = 'USOIL'
	const US10Y = 'US10Y'
	const XAUUSD = 'XAUUSD'

	if (!url) {
		logger.error('MARKET_URL environment variable is not defined.')
		return
	}

	try {
		const response: AxiosResponse<Buffer> = await axios.get(url, { headers: marketIndexHeaders })
		const htmlContent = iconv.decode(response.data, 'utf-8')
		const $ = cheerio.load(htmlContent)

		const getParams = (symbol: string): MarketIndexParams => {
			let template
			if (symbol === USOIL) {
				template = `tr[data-symbol="CL1:COM"]`
			} else if (symbol === US10Y) {
				template = 'tr[data-symbol="USGG10YR:IND"]'
			} else {
				template = `tr[data-symbol="${symbol}:CUR"]`
			}
			const row = $(template)
			const val = row.find('td#p').text().trim()
			const chValue = row.find('td#pch').text().trim().replace('%', '')
			console.log(`${symbol}的值: `, +val, '%Chg: ', chValue)
			return {
				symbol,
				price: +val,
				change: +chValue,
			}
		}

		const symbols: string[] = ['BTCUSD', 'DXY', USOIL, US10Y, XAUUSD]
		for (const symbol of symbols) {
			const param = getParams(symbol)
			const lastOne = await marketIndexService.getLstOne(symbol)
			const lastPrice = get(lastOne, 'price', null)

			if (lastPrice !== null) {
				param.volatility = +((param.price - lastPrice) / lastPrice) * 100
			}

			await marketIndexService.create(param)
		}
	} catch (e: any) {
		logger.error(e.message)
	}
}

function extractCMData(data: string): Article[] {
	const $ = cheerio.load(data)
	const articles: Article[] = []

	$('article').each((index, element) => {
		const html = $(element)
		const title = html.find('.read-title a').text().trim()
		const publisher = html.find('.author-links .posts-author a').text().trim()
		const release_time = html.find('.posts-date').text().trim()
		const web_url = html.find('.read-title a').attr('href') || ''

		articles.push({
			title,
			release_time,
			publisher,
			web_url,
		})
	})

	return articles
}

function fetchCMNews(): void {
	const scheduleSec = new Schedule({ countdown: 10 })
	let initialPage = 5
	let url: string = `${process.env.CM_NEWS_URL}page/${initialPage}/`

	if (!url) {
		logger.error('CM_NEWS_URL environment variable is not defined.')
		return
	}

	const agent = new https.Agent({ rejectUnauthorized: false })

	scheduleSec.startInterval(async () => {
		if (initialPage <= 0) {
			scheduleSec.removeInterval()
			logger.info('---request CM News End---')
			return
		}

		try {
			const res = await axios.get(url, { headers: CM_Headers, httpsAgent: agent })
			const data = get(res, 'data', {})
			let arr = extractCMData(data)

			if (!isArray(arr) || !arr.length) {
				logger.error('extract Nothing From Tech, HTML解析錯誤？')
				return
			}

			for (const vo of arr) {
				try {
					const parsedDate = util.parseChineseDate(vo.release_time)
					const release_time = dayjs(parsedDate).toISOString()

					await db.tech_investment_news.create({ ...vo, release_time })
					await TechNews.create(vo)
				} catch (e: any) {
					console.warn((e as Error).message)
				}
			}
		} catch (e: any) {
			console.error((e as Error).message)
		}

		if (initialPage > 2) {
			initialPage -= 1
			url = `${process.env.CM_NEWS_URL}page/${initialPage}/`
		} else if (initialPage <= 2) {
			initialPage -= 1
			url = process.env.CM_NEWS_URL || ''
		}
	})
}

interface StockPriceData {
	company: string
	price: number
	dayChg: string
	yearChg: string
	MCap: string
	date: Date
}

async function fetchStockPrices(): Promise<void> {
	try {
		const res = await db.StockPrice.findOne({
			attributes: ['createdAt'],
			order: [['createdAt', 'DESC']],
			limit: 1,
		})

		let canGet = false
		if (!res) {
			logger.warn('No StockPrices found in  table')
			canGet = true
		} else {
			const lastCreatedTime = res.createdAt
			canGet = dayjs().isAfter(dayjs(lastCreatedTime).add(24, 'hour'))
		}

		if (!canGet) {
			logger.info('Skipping fetch: Data fetched within last 24 hours.')
			return
		}

		const url: string = process.env.STOCK_PRICES_URL || ''
		console.log('request url:', url)
		const resp = await axios.get(url, { headers: marketIndexHeaders, responseType: 'arraybuffer' })
		const htmlContent = iconv.decode(resp.data, 'utf-8')
		const $ = cheerio.load(htmlContent)

		const componentsTable = $('.table-minimize').eq(1).find('table')

		const stockPrices: StockPriceData[] = []

		componentsTable.find('tbody tr').each((_, row) => {
			const $row = $(row)

			const company = $row.find('td').eq(0).text().trim()
			const priceText = $row.find('td#p').text().trim().replace(/,/g, '')
			const dayChg = $row.find('td#pch').text().trim()
			const yearChg = $row.find('td').eq(5).text().trim()
			const MCap = $row.find('td').eq(6).text().trim()
			const dateText = $row.find('td#date').text().trim()

			const price = parseFloat(priceText)
			if (isNaN(price)) {
				logger.warn(`Invalid price for ${company}: ${priceText}`)
				return
			}

			const currentYear = new Date().getFullYear()
			const date = dayjs(`${dateText}/${currentYear}`, 'MMM/DD/YYYY').toDate()
			if (!dayjs(date).isValid()) {
				logger.warn(`Invalid date for ${company}: ${dateText}`)
				return
			}

			stockPrices.push({
				company,
				price,
				dayChg,
				yearChg,
				MCap,
				date,
			})
		})

		if (stockPrices.length > 0) {
			await db.StockPrice.bulkCreate(stockPrices)
			logger.info(`Successfully saved ${stockPrices.length} stock price records.`)
		} else {
			logger.warn('No stock price data extracted.')
		}
	} catch (e: any) {
		logger.error(`Error fetching stock prices: ${(e as Error).message}`)
	}
}

module.exports = {
	fetchTnews,
	fetchStatements,
	fetchMarketIndex,
	fetchCMNews,
	fetchStockPrices,
}
