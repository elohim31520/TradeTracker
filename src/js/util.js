const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
const _ = require('lodash')

function getTimeNow() {
	return dayjs().format('YYYY-MM-DD HH_mm_ss')
}

function FileNameToTime(str) {
	// YYYY-MM-DD HH_mm_ss
	if (!str) return ''
	let date = str.slice(0, 11)
	let time = str.slice(11).replace(/_/g, ':')
	return date + time
}

function timeToFileName(str) {
	// YYYY-MM-DD HH_:m:ss
	if (!str) return ''
	let date = str.slice(0, 11)
	let time = str.slice(11).replace(/:/g, '_')
	return date + time
}

function replaceDotToDash(str) {
	return str.replace('.', '-')
}

const generateRandomID = () => Math.random().toString(36).slice(2)

function zhTimeToStandardTime(dateString) {
	if (!dateString) return ''
	// const dateString = '2023 年 07 月 26 日 9:45';

	const dateRegex = /(\d{4}) 年 (\d{2}) 月 (\d{2}) 日 (\d{1,2}):(\d{2})/
	const [, year, month, day, hours, minutes] = dateString.match(dateRegex)

	const standardTime = `${year}-${month}-${day} ${hours}:${minutes}`

	return standardTime
}

// 获取月份列表函数
function getMonthList() {
	const months = []
	for (let i = 0; i < 12; i++) {
		months.push(dayjs().month(i).format('MMM'))
	}
	return months
}

function parseChineseDate(dateString) {
	const regex = /(\d{4}) 年 (\d{1,2}) 月 (\d{1,2}) 日/
	const match = dateString.match(regex)

	if (match) {
		const [_, year, month, day] = match
		return dayjs.utc(`${year}-${month}-${day}`).toDate() // 使用 UTC 轉換
	}

	return null
}

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8 // (5)
		return v.toString(16) // (6)
	})
}

module.exports = {
	getTimeNow,
	FileNameToTime,
	timeToFileName,
	replaceDotToDash,
	generateRandomID,
	zhTimeToStandardTime,
	getMonthList,
	parseChineseDate,
	uuidv4,
}
