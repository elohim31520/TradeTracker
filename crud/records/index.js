const sequelize = require("../../js/connect");

function sqlGet(table, { userId, company }) {
	return table.findAll({
		where: {
			userId,
			company
		},
		raw: true
	})
}

async function sqlUpdate(table, params) {
	let criteria = {
		userId: params.userId,
		company: params.company
	}
	const record = await table.findOne({ where: criteria, raw: true })
	if (record) {
		return table.update(params, {
			where: criteria
		})
	} else {
		await sequelize.sync()
		return sqlBulkCreate(table, [params])
	}
}

async function sqlCreate(table, params) {
	await sequelize.sync()
	return table.create(params)
}

async function sqlBulkCreate(table, arr) {
	await sequelize.sync()
	return table.bulkCreate(arr)
}

function sqlDelete(table, { id, userId }) {
	return table.destroy({
		where: {
			id,
			userId
		}
	})
}

function sqlGetAvg(table, userId) {
	return sequelize.query(
		`SELECT
            AVG(price) as average_price ,
            ROUND(SUM(share), 2) as Total_share,
            ROUND(SUM(total), 2) as Total_account,
            company,
            userId
            FROM :table WHERE userId = :id GROUP BY company`,
		{
			type: sequelize.QueryTypes.SELECT,
			replacements: { id: userId, table }
		}
	)
}

module.exports = {
	sqlCreate,
	sqlUpdate,
	sqlGet,
	sqlDelete,
	sqlGetAvg,
	sqlBulkCreate
}