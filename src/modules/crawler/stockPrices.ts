import axios from 'axios'
const cheerio = require('cheerio')
import _ from 'lodash'
require('dotenv').config()
import { MARKET_INDEX_HEADERS } from '../../constant/config'
import { decodeBuffer } from '../util'
const logger = require('../../logger')
import { convertToEST } from '../date'
const db = require('../../../models')

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

async function extractDataFromHtml(htmlContent: string): Promise<StockPrice[]> {
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

export async function crawlStockPrices(): Promise<void> {
	try {
		const url: string | undefined = process.env.STOCK_PRICES_URL
		if (!url) {
			logger.error('STOCK_PRICES_URL沒有定義！')
			return
		}
		const resp = await axios.get(url, {
			headers: MARKET_INDEX_HEADERS,
			responseType: 'arraybuffer',
		})
		const html = decodeBuffer(resp.data)
		const stockPrices = await extractDataFromHtml(html)

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