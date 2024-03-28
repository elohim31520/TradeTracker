const ajax = require('../ajax')

function getAll (){
	ajax.get('/marketindex')
}

getAll()