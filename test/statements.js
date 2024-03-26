const { get } = require('lodash')
const ajax = require('./ajax')

function getStatements(symbo) {
	ajax.get(`/statements/${symbo}`)
}

getStatements('MSFT')
