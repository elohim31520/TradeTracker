import axios from 'axios'
const cheerio = require('cheerio')
import _ from 'lodash'
require('dotenv').config()

import { TC_HEADER } from '../../constant/config'
import { zhTimeStringToStandard, normalizeDate } from '../date'

const logger = require('../../logger')
const db = require('../../../models')

interface Article {
	title: string
	web_url: string
	release_time: string
	publisher: string
}

function extractDataFromHtml(html: string): Article[] {
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

function getTechNewsUrl(page: number): string {
	if (page <= 0) {
		return process.env.TECHNEWS_URL || ''
	}
	return `${process.env.TECHNEWS_URL}page/${page}/`
}

async function fetchTechNews(page: number): Promise<Article[]> {
	const techUrl = getTechNewsUrl(page)
	const res = await axios.get(techUrl, { headers: TC_HEADER })
	const data = _.get(res, 'data', {})
	return extractDataFromHtml(data)
}

export async function crawlTechNews(): Promise<void> {
	const totalPage = 5
	const sleepTime = 10 * 1000

	try {
		for (let page = totalPage; page >= 0; page--) {
			let arr = await fetchTechNews(page)

			if (!arr.length) {
				logger.warn('沒從html中解析出資料！')
				return
			}

			for (const article of arr) {
				const parsedDate = normalizeDate(article.release_time)
				if (!parsedDate) {
					console.warn(`release_time格式錯誤: ${article.release_time}`)
					return
				}
				await db.tech_investment_news.create({ ...article, release_time: parsedDate })
			}
			await new Promise((resolve) => setTimeout(resolve, sleepTime))
		}
	} catch (e: any) {
		console.error((e as Error).message)
	}
}
