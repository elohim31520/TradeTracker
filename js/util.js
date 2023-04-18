const dayjs = require('dayjs')
const cryptoJS = require('crypto-js');

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

function md5Encode(message) {
    var hash = cryptoJS.MD5(message);

    return hash.toString(cryptoJS.enc.Hex)
}

const generateRandomID = () => Math.random().toString(36).slice(2)

function generateSalt() {
    // 生成一個16字節（128位）的隨機salt
    var salt = cryptoJS.lib.WordArray.random(16);
    // 輸出16進位格式的salt
    return salt.toString(cryptoJS.enc.Hex)
}

function sha256(pwd, salt) {
    let message = pwd + salt
    return cryptoJS.SHA256(message).toString();
}

module.exports = {
    getTimeNow,
    FileNameToTime,
    timeToFileName,
    replaceDotToDash,
    md5Encode,
    generateRandomID,
    generateSalt,
    sha256
}