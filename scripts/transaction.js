const ajax = require('./ajax')

function add(data) {
	ajax.post('/transactions', data)
}

function del(id) {
	ajax.delete(`/transactions/${id}`)
}

// 假資料
const transactionData = {
	stock_id: 'MSFT',
	transaction_type: 'sell',
	quantity: 10,
	price: 50,
}

add(transactionData)
