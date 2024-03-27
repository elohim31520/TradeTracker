const fs = require('fs')
const cheerio = require('cheerio')
const path = require('path')
const htmlPath = path.join(__dirname, 'btc.html')

const htmlContent = fs.readFileSync(htmlPath, 'utf8')
const $ = cheerio.load(htmlContent)

const btcRow = $('tr[data-symbol="BTCUSD:CUR"]')
const btcValue = btcRow.find('td#p').text().trim()
const pchValue = btcRow.find('td#pch').text().trim()

const dxyRow = $('tr[data-symbol="DXY:CUR"]').eq(0)
const dxyValue = dxyRow.find('td#p').text().trim()
const dxyPch = dxyRow.find('td#pch').text().trim()

console.log("DXY的值:", +dxyValue, '%Chg: ', dxyPch.replace('%', ''));
console.log("BTCUSD的值:", +btcValue, '%Chg: ', pchValue.replace('%', ''));
