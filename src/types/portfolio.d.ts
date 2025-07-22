export interface Portfolio {
	id: number
	user_id: number
	stock_id: number
	quantity: number
	average_price: number
	createdAt: Date
	updatedAt: Date
	Company?: {
		name: string
		symbol: string
	}
}
