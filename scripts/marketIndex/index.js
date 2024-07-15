const ajax = require('../ajax')

function getAll (){
	ajax.get('/marketindex')
}

function getMomentum (){
	ajax.get('/marketindex/momentum')
}

getMomentum()