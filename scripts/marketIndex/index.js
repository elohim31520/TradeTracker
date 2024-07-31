const ajax = require('../ajax')

function getAll() {
	ajax.get('/marketindex')
}

function getMomentum() {
	ajax.get('/marketindex/momentum')
}

function getLastOne(symbol) {
	ajax.get(`/marketindex/last/${symbol}`)
}

// getAll()
// getLastOne('btcusd')
getMomentum()
