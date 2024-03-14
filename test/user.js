const axios = require('axios')
const { API_HOST } = require('./config')
const fs = require('fs')
const path = require('path')
const { get } = require('lodash')

function register({ user_name, pwd, email }) {
	axios
		.post(`${API_HOST}/users/register`, {
			user_name,
			pwd,
			email,
		})
		.then((res) => {
			console.log(res.data)
			const data = get(res, 'data.token', '')
			writeToken(data)
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
			const data = get(res, 'data.token', '')
			writeToken(data)
		})
		.catch((err) => {
			console.log(err)
		})
}

function writeToken(data) {
	fs.writeFile(path.join(__dirname, 'token.txt'), data, (err) => {
		if (err) {
			console.error('Error writing token to file:', err)
		} else {
			console.log('Token saved to token.txt')
		}
	})
}

// register({ user_name: 'lewis7063', pwd: 'a123456+', email: 'lewis.lee@gmail.com' })
login({ user_name: 'lewis7063', pwd: 'a123456+' })
