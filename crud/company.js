const Company = require("../modal/company")

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
		if (res) console.log("寫入symbol成功 ", symbol)
	} catch (e) {
		console.log(e);
		console.error('SQL寫入失敗')
	}
}

module.exports = {
	sqlQueryCompany,
	sqlCreateCompany
}