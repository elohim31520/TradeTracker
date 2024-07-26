const ajax = require('./ajax')

function getAll(query) {
	ajax.get(`/technews${query}`)
}

function getById(id) {
	ajax.get(`/technews/${id}`)
}

// getById(39690)
getAll('?page=5&size=5')