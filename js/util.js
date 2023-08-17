const dayjs = require('dayjs')

function getTimeNow() {
	return dayjs().format('YYYY-MM-DD HH_mm_ss')
}

function FileNameToTime(str) {
	// YYYY-MM-DD HH_mm_ss
	if (!str) return ''
	let date = str.slice(0, 11)
	let time = str.slice(11).replace(/_/g, ":")
	return date + time
}

function timeToFileName(str) {
	// YYYY-MM-DD HH_:m:ss
	if (!str) return ''
	let date = str.slice(0, 11)
	let time = str.slice(11).replace(/:/g, "_")
	return date + time
}

function replaceDotToDash(str) {
	return str.replace(".", "-")
}

const generateRandomID = () => Math.random().toString(36).slice(2)

function zhTimeToStandardTime(dateString) {
	if (!dateString) return ""
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

module.exports = {
	getTimeNow,
	FileNameToTime,
	timeToFileName,
	replaceDotToDash,
	generateRandomID,
	zhTimeToStandardTime,
	getMonthList
}