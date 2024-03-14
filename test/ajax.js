const axios = require('axios')
const { token } = require('./config')
const { get } = require('lodash')
const { API_HOST } = require('./config')

const instance = axios.create({
	timeout: 10000,
	baseURL: API_HOST
})

instance.interceptors.request.use(
	(config) => {
		config.headers.Authorization = `Bearer ${token}`
		return config
	},
	(error) => {
		console.error('Request error:', error)
		return Promise.reject(error)
	}
)

instance.interceptors.response.use(
	(response) => {
		const data = get(response, 'data', '')
		console.log('Response received:', data)
		return response
	},
	(error) => {
		console.error('Response error:', error)
		return Promise.reject(error)
	}
)

module.exports = instance
