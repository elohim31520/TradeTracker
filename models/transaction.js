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

	Transaction.afterCreate(async (transaction, options) => {
		const { user_id, stock_id, transaction_type, quantity, price } = transaction
		const portfolio = await sequelize.models.Portfolio.findOne({
			where: { user_id, stock_id },
		})

		if (transaction_type === 'buy') {
			if (portfolio) {
				// 更新現有持倉
				const newQuantity = +portfolio.quantity + +quantity
				const newAveragePrice = (portfolio.average_price * portfolio.quantity + price * quantity) / newQuantity
				await portfolio.update({
					quantity: newQuantity,
					average_price: newAveragePrice,
				})
			} else {
				// 創建新的持倉
				await sequelize.models.Portfolio.create({
					user_id,
					stock_id,
					quantity,
					average_price: price,
				})
			}
		} else if (transaction_type === 'sell') {
			if (portfolio) {
				const newQuantity = +portfolio.quantity - +quantity
				if (newQuantity >= 0) {
					await portfolio.update({
						quantity: newQuantity,
					})
				} else {
					throw new Error('賣出的股票數量超過持倉')
				}
			} else {
				throw new Error('無持有的股票可以賣出')
			}
		}
	})

	return Transaction
}
