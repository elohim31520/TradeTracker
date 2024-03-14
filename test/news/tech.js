const axios = require('axios')
const { headers } = require('../config')

const dayjs = require('dayjs')
let endDate = dayjs().toDate()
let startDate = dayjs().startOf('day').subtract(1, 'day').toDate()

function get(data) {
	const url = `${API_HOST}/news/tech/`
	axios
		.post(url, data, headers)
		.then((res) => {
			console.log(res.data)
		})
		.catch((err) => {
			console.log(err.message)
			console.log(err.response.data)
		})
}

function getOne(id) {
	const url = `${API_HOST}/news/tech/${id}`
	axios
		.get(url, headers)
		.then((res) => {
			console.log(res.data)
		})
		.catch((err) => {
			console.log(err.message)
			console.log(err.response.data)
		})
}

function subscribe(data) {
	const url = `${API_HOST}/subscribe/technews`
	axios
		.post(url, data, headers)
		.then((res) => {
			console.log(res.data)
		})
		.catch((err) => {
			console.log(err.message)
			console.log(err.response.data)
		})
}

function getMySubscribes() {
	const url = `${API_HOST}/subscribe/technews`
	axios
		.get(url, headers)
		.then((res) => {
			console.log(res.data)
		})
		.catch((err) => {
			console.log(err.message)
			console.log(err.response.data)
		})
}

// get({
// 	pageIndex: 1,
// 	pageSize: 1000,
// 	keyword: 'TikTok'
// })

// getOne(11812)

// subscribe({
// 	newsId: 14804
// })

// getMySubscribes()
