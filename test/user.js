const fs = require('fs')
const path = require('path')
const { get } = require('lodash')
const ajax = require('./ajax')

function register({ user_name, pwd, email }) {
	ajax
		.post(`/users/register`, {
			user_name,
			pwd,
			email,
		})
		.then((res) => {
			const data = get(res, 'data.token', '')
			writeToken(data)
		})
}

function login({ user_name, pwd }) {
	ajax
		.post(`/users/login`, {
			user_name,
			pwd,
		})
		.then((res) => {
			const data = get(res, 'data.token', '')
			writeToken(data)
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
