const axios = require('axios').default;

const { replaceDotToDash } = require("./util");

class Fetch {
    constructor({ requestUrl, stockSymbols }) {
        this.requestUrl = requestUrl
        this.stockSymbols = stockSymbols || []
        this.index = 0
        this.errorSymbo = []
    }

    getHtml() {
        if (!this.stockSymbols.length) return Promise.reject('Empty Stock Symbols')
        if (this.index > this.stockSymbols.length) return Promise.reject({ code: 999, msg: 'all already Fetch' })

        let symbo = this.getRequestSymbo()
        if (!symbo) {
            return Promise.reject('no symbo!')
        }

        const url = this.requestUrl + replaceDotToDash(symbo) + '&p=d'
        if (!url) return Promise.reject('Empty Url')

        console.log(`request Url : ${url}`);
        return axios.get(url).then(res => {
            this.index++
            return res
        })
    }

    getRequestSymbo() {
        return this.stockSymbols[this.index]
    }

    pushErrorSymobo() {
        let sym = this.getRequestSymbo()
        this.errorSymbo.push(sym)
    }

    getAllErrorSymbo() {
        return this.errorSymobo
    }
}


module.exports = Fetch