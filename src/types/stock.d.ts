export interface StockPrice {
	id: number;
	symbol: string;
	company: string;
	price: number;
	dayChg: string;
	yearChg: string;
	MCap: string;
	date: string;
	timestamp: string;
	createdAt: string;
}

export interface StockPriceAlias {
	id?: number;
	symbol?: string;
	name: string;
	price: number;
	chg: string;
	ychg: string;
	cap: string;
	time: string;
}
