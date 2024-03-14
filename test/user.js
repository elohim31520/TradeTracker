const axios = require('axios')
const { API_HOST } = require('./config')

function register({ user_name, pwd, email }) {
	axios
		.post(`${API_HOST}/users/register`, {
			user_name,
			pwd,
			email,
		})
		.then((res) => {
			console.log(res.data)
		})
		.catch((err) => {
			console.log(err)
		})
}

function login({ user_name, pwd }) {
	axios
		.post(`${API_HOST}/users/login`, {
			user_name,
			pwd,
		})
		.then((res) => {
			console.log(res.data)
		})
		.catch((err) => {
			console.log(err)
		})
}

register({ user_name: 'lewis7063', pwd: 'a123456+', email: 'lewis.lee@gmail.com' })
