const axios = require('axios')
const { headers } = require('../token')

const API_HOST = 'http://localhost:1234/transaction'

function update({ id, query = '', data, model }) {
	const url = `${API_HOST}/${model}/${id}${query}`
	console.log(url);
	axios.put(url, data, headers).then(res => {
		console.log(res.data);
	}).catch(err => {
		console.log(err.message);
	})
}

function patch({ id, query = '', data, model }) {
	const url = `${API_HOST}/${model}/${id}${query}`
	axios.patch(url, data, headers).then(res => {
		console.log(res.data);
	}).catch(err => {
		console.log(err.message);
	})
}


function del({ id, query = '', model }) {
	const url = `${API_HOST}/${model}/${id}${query}`
	axios.delete(url, headers).then(res => {
		console.log(res.data);
	}).catch(err => {
		console.log(err.message);
	})
}

function get(url) {
	return axios.get(url, headers).then(res => {
		console.log(res.data);
		return res.data
	}).catch(err => {
		console.log(err.message);
	})
}

function add(data, model) {
	const url = `${API_HOST}/${model}`
	console.log(url);
	axios.post(url, data, headers).then(res => {
		console.log(res.data);
	}).catch(err => {
		console.log(err.message);
		console.log(err.response.data);
	})
}

module.exports = {
	get,
	add,
	del,
	update,
	patch
}