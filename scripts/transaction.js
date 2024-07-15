const fs = require('fs')
const path = require('path')
const { get } = require('lodash')
const ajax = require('./ajax')

function add(data) {
	ajax
		.post('http://localhost:1234/transactions', data)
		.then((response) => {
			console.log('Transaction added:', response.data)
		})
		.catch((error) => {
			console.error('Error adding transaction:', error)
		})
}

// 假資料
const transactionData = {
	stock_id: 'MSFT',
	transaction_type: 'buy',
	quantity: 50,
	price: 200.00,
};
add(transactionData)