export interface Portfolio {
	id?: number
	user_id: number
	company_id: number
	quantity: number
	average_price: number
	createdAt?: Date
	updatedAt?: Date
	Company?: {
		name: string
		symbol: string
	}
}

export interface PortfolioResponse {
	id: number
	quantity: number
	avg: number
	stock_id?: string
	company?: {
		name: string
		symbol: string
	}
}
