'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Transaction extends Model {
		static associate(models) {
			Transaction.belongsTo(models.Users, { foreignKey: 'user_id' })
		}
	}
	Transaction.init(
		{
			user_id: DataTypes.INTEGER,
			stock_id: DataTypes.INTEGER,
			transaction_type: DataTypes.ENUM('buy', 'sell'),
			quantity: DataTypes.INTEGER,
			price: DataTypes.DECIMAL(10, 2),
			transaction_date: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'Transaction',
			tableName: 'Transactions',
		}
	)
	return Transaction
}
