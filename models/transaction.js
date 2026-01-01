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
			company_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Transaction',
			tableName: 'transactions',
		}
	)

	const updatePortfolioAndBalance = async (transactions, options) => {
		const { Portfolio, UserBalance } = sequelize.models
		const t = options.transaction

		if (!t) {
			console.warn('⚠️ 警告: 執行交易相關操作未檢測到事務，可能導致資料不一致！')
		}

		// 2. 必須使用串行處理 (For Loop)，不能使用 Promise.all
		// 因為在同一個事務中，我們希望後一筆交易能讀到前一筆交易更新後的結果
		for (const transaction of transactions) {
			const { user_id, stock_id, transaction_type, quantity, price } = transaction
			const transactionTotal = Number(price) * Number(quantity)

			// --- A. 更新股票持倉 (Portfolio) ---
			// 3. 使用悲觀鎖 (Lock) 查找持倉
			// 如果這行被鎖住，其他事務必須等待直到當前事務 Commit/Rollback
			let [portfolio, created] = await Portfolio.findOrCreate({
				where: { user_id, stock_id },
				defaults: {
					user_id,
					stock_id,
					quantity: 0,
					average_price: 0,
				},
				transaction: t,
				lock: t ? t.LOCK.UPDATE : null, // 找到或建立後，鎖住該行直到事務結束
			})

			const currentQty = Number(portfolio.quantity)
			const currentAvgPrice = Number(portfolio.average_price)

			if (transaction_type === 'buy') {
				const newQuantity = currentQty + quantity
				const newAveragePrice =
					newQuantity > 0 ? (currentAvgPrice * currentQty + transactionTotal) / newQuantity : price

				await portfolio.update(
					{
						quantity: newQuantity,
						average_price: newAveragePrice,
					},
					{ transaction: t }
				)
			} else if (transaction_type === 'sell') {
				const newQuantity = currentQty - quantity
				if (newQuantity < 0) {
					throw new Error(`庫存不足: Stock ${stock_id} 當前 ${currentQty}, 欲賣出 ${quantity}`)
				}

				// 這裡可以選擇刪除或更新為0，這裡選擇更新
				await portfolio.update({ quantity: newQuantity }, { transaction: t })
			}

			// --- B. 更新 USD 持倉 (UserBalance) ---

			// 同樣使用鎖來獲取餘額
			let userBalance = await UserBalance.findOne({
				where: { user_id, currency: 'USD' },
				transaction: t,
				lock: t ? t.LOCK.UPDATE : null,
			})

			if (!userBalance) {
				userBalance = await UserBalance.create(
					{
						user_id,
						currency: 'USD',
						balance: 0,
					},
					{ transaction: t }
				)
			}

			// 使用 atomic increment/decrement 會更安全，但也需要事務支持
			if (transaction_type === 'buy') {
				await userBalance.decrement('balance', {
					by: transactionTotal,
					transaction: t,
				})
			} else if (transaction_type === 'sell') {
				await userBalance.increment('balance', {
					by: transactionTotal,
					transaction: t,
				})
			}
		}
	}

	Transaction.afterCreate(async (transaction, options) => {
		await updatePortfolioAndBalance([transaction], options)
	})

	Transaction.afterBulkCreate(async (transactions, options) => {
		await updatePortfolioAndBalance(transactions, options)
	})

	return Transaction
}
