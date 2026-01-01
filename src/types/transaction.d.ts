export interface TransactionAttributes {
	id: number
	user_id: number
	company_id: number
	transaction_type: 'buy' | 'sell'
	quantity: number
	price: number
	transaction_date: Date
	createdAt: Date
	updatedAt: Date
}

export type TransactionCreationAttributes = Omit<TransactionAttributes, 'id' | 'createdAt' | 'updatedAt'>

export interface TransactionPartial {
	id: number
	company_id: number
	type: 'buy' | 'sell'
	quantity: number
	price: number
	date: Date
}