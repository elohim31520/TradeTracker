import axios from 'axios'
const cheerio = require('cheerio')
import _ from 'lodash'
require('dotenv').config()

import { MARKET_INDEX_HEADERS } from '../../constant/config'
const { BTCUSD, USOIL, DXY, US10Y, XAUUSD } = require('../../constant/market')
import { decodeBuffer } from '../util'
const logger = require('../../logger')
const marketIndexService = require('../../services/marketIndexService')

interface MarketIndexAttribute {
	symbol: string
	price: number
	change: number
}

function extractDataFromHtml($: cheerio.CheerioAPI, symbol: string): MarketIndexAttribute {
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

export async function crawlMarketIndex(): Promise<void> {
	const url = process.env.MARKET_URL

	if (!url) {
		logger.error('MARKET_URL環境變數沒定義！')
		return
	}

	try {
		const res = await axios.get(url, { headers: MARKET_INDEX_HEADERS })
		const htmlContent = decodeBuffer(res.data)
		const $ = cheerio.load(htmlContent)
		const symbols: string[] = [BTCUSD, DXY, USOIL, US10Y, XAUUSD]
		for (const symbol of symbols) {
			const param = extractDataFromHtml($, symbol)
			await marketIndexService.create(param)
		}
	} catch (e: any) {
		logger.error(e.message)
	}
}
