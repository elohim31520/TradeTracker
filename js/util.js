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

module.exports = {
    getTimeNow,
    FileNameToTime,
    timeToFileName,
    replaceDotToDash,
    generateRandomID
}