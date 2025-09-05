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
			stock_id: DataTypes.STRING,
			transaction_type: DataTypes.ENUM('buy', 'sell'),
			quantity: DataTypes.INTEGER,
			price: DataTypes.DECIMAL(10, 2),
			transaction_date: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: 'Transaction',
			tableName: 'transactions',
		}
	)

	Transaction.afterCreate(async (transaction, options) => {
		const { user_id, stock_id, transaction_type, quantity, price } = transaction
		const { Portfolio } = sequelize.models
		const transactionTotal = price * quantity

		// 更新股票持倉
		const [portfolio, created] = await Portfolio.findOrCreate({
			where: { user_id, stock_id },
			defaults: {
				user_id,
				stock_id,
				quantity: 0,
				average_price: 0,
			},
		})

		if (transaction_type === 'buy') {
			const newQuantity = portfolio.quantity + quantity
			const newAveragePrice =
				newQuantity > 0
					? (portfolio.average_price * portfolio.quantity + transactionTotal) / newQuantity
					: price
			await portfolio.update({
				quantity: newQuantity,
				average_price: newAveragePrice,
			})
		} else if (transaction_type === 'sell') {
			const newQuantity = portfolio.quantity - quantity
			if (newQuantity < 0) {
				throw new Error('賣出的股票數量超過持倉')
			}
			if (newQuantity === 0) {
				await portfolio.destroy()
			} else {
				await portfolio.update({ quantity: newQuantity })
			}
		}

		// 更新USD持倉
		const [usdPortfolio, usdCreated] = await Portfolio.findOrCreate({
			where: { user_id, stock_id: 'USD' },
			defaults: {
				user_id,
				stock_id: 'USD',
				quantity: 0,
				average_price: 1,
			},
		})

		if (transaction_type === 'buy') {
			await usdPortfolio.decrement('quantity', { by: transactionTotal })
		} else if (transaction_type === 'sell') {
			await usdPortfolio.increment('quantity', { by: transactionTotal })
		}
	})

	return Transaction
}
