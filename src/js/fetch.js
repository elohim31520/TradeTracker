const axios = require('axios').default

const { replaceDotToDash } = require('./util')
const { fzHeader } = require('./config')
const iconv = require('iconv-lite')

class FinzService {
	constructor({ requestUrl = '', stockSymbols = [] }) {
		this.requestUrl = requestUrl
		this.stockSymbols = stockSymbols
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

		console.log(`request Url : ${url}`)
		return axios.get(url, { headers: fzHeader }).then((res) => {
			this.index++
			return res
		})
	}

	getRequestSymbo() {
		return this.stockSymbols[this.index]
	}

	pushErrorSymbo() {
		let sym = this.getRequestSymbo()
		this.errorSymbo.push(sym)
	}

	getAllErrorSymbo() {
		return this.errorSymbo
	}
}

class Sp500Service extends FinzService {
	constructor({ requestUrl = '', stockSymbols = [] }) {
		super({ requestUrl, stockSymbols })
	}

	getHtml() {
		if (!this.stockSymbols.length) return Promise.reject('Empty Stock Symbols')
		if (this.index > this.stockSymbols.length) return Promise.reject({ code: 999, msg: 'all already Fetch' })

		let symbo = this.getRequestSymbo()
		if (!symbo) {
			return Promise.reject('no symbo!')
		}

		const url = this.requestUrl + replaceDotToDash(symbo)
		if (!url) return Promise.reject('Empty Url')

		console.log(`request Url : ${url}`)
		return axios.get(url, { responseType: 'arraybuffer' }).then((response) => {
			this.index++
			const data = iconv.decode(response.data, 'utf-8')
			return data
		})
	}
}

module.exports = {
	FinzService,
	Sp500Service,
}
