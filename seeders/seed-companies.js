const { Company } = require('../models')

const companies = [
	{ symbol: 'AAPL', name: 'Apple Inc.' },
	{ symbol: 'ABNB', name: 'Airbnb, Inc.' }
]

;(async () => {
	try {
		await Company.bulkCreate(companies)
		console.log('Data inserted successfully')
	} catch (error) {
		console.error('Error inserting data:', error)
	}
})()
