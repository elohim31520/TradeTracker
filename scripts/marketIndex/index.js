const ajax = require('../ajax')

function getAll() {
	ajax.get('/marketindex')
}

function getMomentum() {
	ajax.get('/marketindex2/momentum')
}

function getLastOne(symbol) {
	ajax.get(`/marketindex2/last/${symbol}`)
}

// getAll()
// getLastOne('btcusd')
getMomentum()
