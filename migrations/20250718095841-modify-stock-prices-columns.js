'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameTable('stock_prices', 'stock_prices')
		await queryInterface.renameColumn('stock_prices', 'dayChg', 'day_chg')
		await queryInterface.renameColumn('stock_prices', 'yearChg', 'year_chg')
		await queryInterface.renameColumn('stock_prices', 'MCap', 'm_cap')
		await queryInterface.addColumn('stock_prices', 'timestamp', {
			type: Sequelize.DATE,
			allowNull: true,
		})

		await queryInterface.renameColumn('stock_prices', 'createdAt', 'created_at')
		await queryInterface.renameColumn('stock_prices', 'updatedAt', 'updated_at')

		// 2. 修改時間戳記欄位屬性，加入 defaultValue
		await queryInterface.changeColumn('stock_prices', 'created_at', {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		})
		await queryInterface.changeColumn('stock_prices', 'updated_at', {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameColumn('stock_prices', 'day_chg', 'dayChg')
		await queryInterface.renameColumn('stock_prices', 'year_chg', 'yearChg')
		await queryInterface.renameColumn('stock_prices', 'm_cap', 'MCap')
		await queryInterface.removeColumn('stock_prices', 'timestamp')

		// 2. 恢復時間戳記欄位屬性，移除 defaultValue
		await queryInterface.changeColumn('stock_prices', 'created_at', {
			type: Sequelize.DATE,
			allowNull: false,
		})
		await queryInterface.changeColumn('stock_prices', 'updated_at', {
			type: Sequelize.DATE,
			allowNull: false,
		})

		// 3. 將時間戳記欄位名稱還原為駝峰式命名
		await queryInterface.renameColumn('stock_prices', 'created_at', 'createdAt')
		await queryInterface.renameColumn('stock_prices', 'updated_at', 'updatedAt')
		await queryInterface.renameTable('stock_prices', 'StockPrices')
	},
}
