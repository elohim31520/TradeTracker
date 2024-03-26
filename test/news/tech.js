const ajax = require('../ajax')

function get(data) {
	ajax.post('/news/tech', data)
}

function getOne(id) {
	ajax.get(`/news/tech/${id}`)
}

function subscribe(data) {
	ajax.post(`/subscribe/technews`, data)
}

function getMySubscribes() {
	ajax.get(`/subscribe/technews`)
}

// get({
// 	pageIndex: 20,
// 	pageSize: 10,
// 	keyword: 'tesla',
// })

// getOne(11812)

// subscribe({
// 	newsId: 14804
// })

getMySubscribes()
