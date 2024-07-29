const ajax = require('./ajax')

function getStatements(symbo) {
	ajax.get(`/statements/${symbo}`)
}

getStatements('GOOG')
