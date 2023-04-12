const path = require("path");
const fs = require('fs');

const dbDir = path.join(__dirname, `../DB/`)

function getStockSymbol(){
    let file = path.join(__dirname, `../symbol.json`)
    let obj = JSON.parse(fs.readFileSync(file));
    let symbols = obj.symbols
    let arr = []
    symbols.forEach(vo => {
        let sym = vo.split(":")
        arr.push(sym[1])
    });
    return arr
}

/**
 * 配置
 */

const requestUrl = 'https://finviz.com/quote.ashx?t='

const stockSymbols = getStockSymbol()

module.exports = {
    dbDir,
    requestUrl,
    stockSymbols,
}