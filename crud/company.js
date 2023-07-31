const Company = require("../modal/company")
const logger = require("../logger")

function sqlQueryCompany(conditions) {
	return Company.findOne({
		where: conditions
	})
}

async function sqlCreateCompany({ symbol, name }) {
	try {
		const res = await Company.create({
			name,
			symbol
		})
		if (res) {
			logger.info(`寫入symbol成功: ${symbol}`)
			console.log("寫入symbol成功 ", symbol)
		}
	} catch (e) {
		logger.error(e.message)
		console.error('SQL寫入失敗')
	}
}

module.exports = {
	sqlQueryCompany,
	sqlCreateCompany
}