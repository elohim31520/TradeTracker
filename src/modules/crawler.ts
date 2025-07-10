import axios, { AxiosResponse } from 'axios'
import iconv from 'iconv-lite'
const cheerio = require('cheerio')
import { get, isArray } from 'lodash'
import { isAfter, add } from 'date-fns'
require('dotenv').config()

const { Sp500Fetcher } = require('./financialDataFetcher')
import { TC_HEADER, MARKET_INDEX_HEADERS } from '../constant/config'
const { BTCUSD, USOIL, DXY, US10Y, XAUUSD } = require('../constant/market')

import Schedule from './schedule'

const logger = require('../logger')
import { getZonedDate, zhTimeStringToStandard, normalizeDate } from './date'
const marketIndexService = require('../services/marketIndexService')

const db = require('../../models')

interface Article {
	title: string
	web_url: string
	release_time: string
	publisher: string
}

function extractDataFromTechNewsHtml(html: string): Article[] {
	const $ = cheerio.load(html)
	const arr: Article[] = []

	$('table').each((index: number, element: cheerio.Element) => {
		let title = $(element).find('.maintitle h1.entry-title a').text()
		let web_url = $(element).find('.maintitle h1.entry-title a').attr('href') || ''
		let release_time = $(element).find('.head:contains("發布日期")').next().text()
		let publisher = $(element).find('.head:contains("作者")').next().text()

		if (title) {
			title = title.trim()
			web_url = web_url.trim()
			release_time = zhTimeStringToStandard(release_time)
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
			return
		}

		try {
			const res = await axios.get(techUrl, { headers: TC_HEADER })
			const data = get(res, 'data', {})
			let arr = extractDataFromTechNewsHtml(data)

			if (!isArray(arr) || !arr.length) {
				logger.error('extract Nothing From Tech, HTML解析錯誤？')
				return
			}

			for (const vo of arr) {
				try {
					const parsedDate = normalizeDate(vo.release_time)
					if (parsedDate) {
						const release_time = parsedDate
						await db.tech_investment_news.create({ ...vo, release_time })
					} else {
						console.warn(`Invalid date format for release_time: ${vo.release_time}`)
					}
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

		if (!res) logger.warn('No company statements found.')

		const lastCreatedTime = res.createdAt
		const canGet = isAfter(getZonedDate(), add(lastCreatedTime, { hours: 24 }))
		if (!canGet) {
			logger.warn('Skipping fetch Sp500 Statements: Data fetched within last 24 hours.')
			return
		}

		const scheduleSec = new Schedule({ countdown: 6 })
		const companyData = await db.Company.findAll({ raw: true, attributes: ['symbol'] })
		const symbols = new Set(companyData.map((vo: any) => vo.symbol))
		const myFetch = new Sp500Fetcher({ requestUrl: process.env.SP500_URL, stockSymbols: Array.from(symbols) })

		scheduleSec.startInterval(async () => {
			try {
				const symbo = myFetch.getCurrentSymbol()
				if (!symbo) {
					scheduleSec.removeInterval()
					logger.warn(`failed symbol: ${myFetch.getAllErrorSymbols()}`)
					return
				}
				const htmlContent = await myFetch.fetchHtml()
				const $ = cheerio.load(htmlContent)

				const targetTable = $('.row .col-lg-7 .table')
				const tdObject: { [key: string]: string } = {}

				targetTable.find('tbody tr').each((index: number, element: cheerio.Element) => {
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
				logger.error(`Fetch sp500 statements失敗: ${e.message} symbol: ${myFetch.getCurrentSymbol()}`)
				myFetch.addErrorSymbol()
				if (e.code == 999 || httpStatus == 403) {
					scheduleSec.removeInterval()
					return
				}
				myFetch.currentIndex++
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

	if (!url) {
		logger.error('MARKET_URL environment variable is not defined.')
		return
	}

	try {
		const response: AxiosResponse<Buffer> = await axios.get(url, { headers: MARKET_INDEX_HEADERS })
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

		const symbols: string[] = [BTCUSD, DXY, USOIL, US10Y, XAUUSD]
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

interface StockPriceData {
	company: string
	price: number
	dayChg: number
	yearChg: number
	MCap: string
	date: string
	symbol?: string
}

async function fetchStockPrices(): Promise<void> {
	try {
		const symbols = await db.Company.findAll()

		const url: string = process.env.STOCK_PRICES_URL || ''
		const resp = await axios.get(url, { headers: MARKET_INDEX_HEADERS, responseType: 'arraybuffer' })
		const htmlContent = iconv.decode(resp.data, 'utf-8')
		const $ = cheerio.load(htmlContent)

		const componentsTable = $('.table-minimize').eq(1).find('table')
		const rows = componentsTable.find('tbody tr').toArray()

		const stockPrices: StockPriceData[] = []

		// 使用 Promise.all 處理所有行的非同步操作
		await Promise.all(
			rows.map(async (row: cheerio.Element) => {
				const $row = $(row)

				const company = $row.find('td').eq(0).text().trim()
				const priceText = $row.find('td#p').text().trim().replace(/,/g, '')
				const dayChg = $row.find('td#pch').text().trim().replace(/%/g, '')
				const yearChg = $row.find('td').eq(5).text().trim().replace(/%/g, '')
				const MCap = $row.find('td').eq(6).text().trim()
				const date = $row.find('td#date').text().trim()

				const regex = new RegExp(company, 'i')
				const symbol = symbols.find((vo: any) => regex.test(vo.name))?.symbol

				const price = parseFloat(priceText)

				const res = await db.StockPrice.findOne({
					where: {
						company,
						date,
					},
					attributes: ['date'],
					order: [['date', 'DESC']],
					limit: 1,
				})
				const hasData = res?.date

				if (!hasData) {
					stockPrices.push({
						company,
						price,
						dayChg: parseFloat(dayChg),
						yearChg: parseFloat(yearChg),
						MCap,
						date,
						symbol,
					})
				}
			})
		)

		if (stockPrices.length > 0) {
			await db.StockPrice.bulkCreate(stockPrices)
			logger.info(`Successfully inserted ${stockPrices.length} new stock prices.`)
		} else {
			logger.info('No new stock prices to insert.')
		}
	} catch (e: any) {
		logger.error(`Error fetching stock prices: ${(e as Error).message}`)
	}
}

async function migrateTechNews(filePath: string) {
	const fs = require('fs')
	try {
		let rawData: Buffer
		try {
			rawData = fs.readFileSync(filePath)
		} catch (error) {
			throw new Error(`Failed to read file ${filePath}: ${(error as Error).message}`)
		}

		interface News {
			id?: number
			title: string
			web_url: string
			release_time: string
			publisher: string
			createdAt: Date
			updatedAt: Date
		}

		let news: News[]
		try {
			news = JSON.parse(rawData.toString())
			if (!Array.isArray(news)) {
				throw new Error('JSON data is not an array')
			}
		} catch (error) {
			throw new Error(`Failed to parse JSON: ${(error as Error).message}`)
		}

		const results = await Promise.all(
			news.map(async (vo, index) => {
				try {
					const parsedDate = normalizeDate(vo.release_time)
					if (!parsedDate) {
						throw new Error(`Invalid date format for release_time: ${vo.release_time}`)
					}
					const release_time = parsedDate.toISOString()

					const { id, ...rest } = vo
					await db.tech_investment_news.create({ ...rest, release_time })

					return { status: 'success', data: vo }
				} catch (error) {
					logger.warn(`Error processing item at index ${index}: ${(error as Error).message}`, {
						item: vo,
					})
					return {
						status: 'failed',
						data: vo,
						error: (error as Error).message,
					}
				}
			})
		)

		const successCount = results.filter((r) => r.status === 'success').length
		const failedCount = results.length - successCount

		logger.info(`Migration completed: ${successCount} succeeded, ${failedCount} failed`)

		return { successCount, failedCount, failedItems: results.filter((r) => r.status === 'failed') }
	} catch (error) {
		logger.error(`Migration failed: ${(error as Error).message}`)
		throw error
	}
}

module.exports = {
	fetchTnews,
	fetchStatements,
	fetchMarketIndex,
	fetchStockPrices,
	migrateTechNews,
}
