import axios from 'axios'
const cheerio = require('cheerio')
import _ from 'lodash'
import { isAfter, add } from 'date-fns'
require('dotenv').config()

const { Sp500Fetcher } = require('./financialDataFetcher')
import { MARKET_INDEX_HEADERS } from '../constant/config'
import { decodeBuffer } from './util'

import Schedule from './schedule'

const logger = require('../logger')
import { getZonedDate, normalizeDate, convertToEST } from './date'

const db = require('../../models')

interface Article {
	title: string
	web_url: string
	release_time: string
	publisher: string
}

interface News extends Article {
	id?: number
	createdAt: Date
	updatedAt: Date
}

interface Statement {
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

interface StockPrice {
	company: string
	price: number
	dayChg: number
	yearChg: number
	MCap: string
	date: string
	symbol?: string
	timestamp?: string
}

export async function fetchStatements(): Promise<void> {
	try {
		const lastOne = await db.company_statements.findOne({
			attributes: ['createdAt'],
			order: [['createdAt', 'DESC']],
			limit: 1,
			raw: true,
		})

		const lastCreatedTime = lastOne?.createdAt
		const canGet = isAfter(getZonedDate(), add(lastCreatedTime, { hours: 24 }))
		if (!canGet) {
			logger.warn('Skipping fetch Sp500 Statements: Data fetched within last 24 hours.')
			return
		}

		const scheduleSec = new Schedule({ countdown: 6 })
		const companies = await db.Company.findAll({ raw: true, attributes: ['symbol'] })
		const symbols = new Set(companies.map((vo: any) => vo.symbol))
		const myFetch = new Sp500Fetcher({
			requestUrl: process.env.SP500_URL,
			stockSymbols: Array.from(symbols),
		})

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
				const keymap: { [key: string]: keyof Statement } = {
					'P/E (Trailing)': 'PE_Trailing',
					'P/E (Forward)': 'PE_Forward',
					'EPS (Trailing)': 'EPS_Trailing',
					'Prev Close': 'price',
					'EPS (Forward)': 'EPS_Forward',
					'Volume': 'volume',
					'Market Cap': 'marketCap',
				}
				const params: Statement = { symbo }

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

async function extractStockPrices(htmlContent: string): Promise<StockPrice[]> {
	const $ = cheerio.load(htmlContent)
	const componentsTable = $('.table-minimize').eq(1).find('table')
	const rows = componentsTable.find('tbody tr').toArray()
	const stockPrices: StockPrice[] = []
	const symbols = await db.Company.findAll({ raw: true, attributes: ['symbol'] })
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

			const lastOne = await db.StockPrice.findOne({
				where: {
					company,
					date,
				},
				attributes: ['date'],
				order: [['date', 'DESC']],
				limit: 1,
				raw: true,
			})
			const hasData = lastOne?.date

			if (!hasData) {
				stockPrices.push({
					company,
					price,
					dayChg: parseFloat(dayChg),
					yearChg: parseFloat(yearChg),
					MCap,
					date,
					symbol,
					timestamp: convertToEST(date),
				})
			}
		})
	)

	return stockPrices
}

export async function fetchStockPrices(): Promise<void> {
	try {
		const url: string | undefined = process.env.STOCK_PRICES_URL
		if (!url) {
			logger.error('STOCK_PRICES_URL env variable is not defined.')
			return
		}
		const resp = await axios.get(url, {
			headers: MARKET_INDEX_HEADERS,
			responseType: 'arraybuffer',
		})
		const html = decodeBuffer(resp.data)
		const stockPrices = await extractStockPrices(html)

		if (!stockPrices.length) {
			logger.info('No new stock prices to insert.')
			return
		}
		await db.StockPrice.bulkCreate(stockPrices)
		logger.info(`Successfully inserted ${stockPrices.length} new stock prices.`)
	} catch (e: any) {
		logger.error(`Error fetching stock prices: ${(e as Error).message}`)
	}
}

export async function migrateTechNews(filePath: string) {
	const fs = require('fs')
	try {
		let rawData: Buffer
		try {
			rawData = fs.readFileSync(filePath)
		} catch (error) {
			throw new Error(`Failed to read file ${filePath}: ${(error as Error).message}`)
		}

		let news: News[]
		try {
			news = JSON.parse(rawData.toString())
			if (!_.isArray(news)) {
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
