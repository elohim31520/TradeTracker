'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * 使用 changeColumn 修改欄位屬性
		 * 由於 model 設定了 underscored: true，資料庫欄位通常是 snake_case
		 */
		await queryInterface.changeColumn('stock_prices', 'timestamp', {
			type: Sequelize.STRING,
			allowNull: true,
		})

		await queryInterface.changeColumn('stock_prices', 'date', {
			type: Sequelize.STRING,
			allowNull: true,
		})

		await queryInterface.changeColumn('stock_prices', 'm_cap', {
			// MCap 對應 m_cap
			type: Sequelize.STRING,
			allowNull: true,
		})

		await queryInterface.changeColumn('stock_prices', 'year_chg', {
			// yearChg 對應 year_chg
			type: Sequelize.DECIMAL,
			allowNull: true,
		})

		await queryInterface.addColumn('stock_prices', 'weight', {
			type: Sequelize.DECIMAL(10, 2),
			allowNull: true,
			comment: '權重',
		})

    await queryInterface.changeColumn('stock_prices', 'price', {
      type: Sequelize.DECIMAL(10, 2)
    });
	},

	async down(queryInterface, Sequelize) {
		/**
		 * 回滾操作：若需還原，可在此設定回原本的屬性（例如改回 allowNull: false）
		 */
		await queryInterface.removeColumn('stock_prices', 'weight')

    await queryInterface.changeColumn('stock_prices', 'price', {
			type: Sequelize.DECIMAL,
		})

		await queryInterface.changeColumn('stock_prices', 'timestamp', {
			type: Sequelize.STRING,
			allowNull: false,
		})
		await queryInterface.changeColumn('stock_prices', 'date', {
			type: Sequelize.STRING,
			allowNull: false,
		})
		await queryInterface.changeColumn('stock_prices', 'm_cap', {
			type: Sequelize.STRING,
			allowNull: false,
		})
		await queryInterface.changeColumn('stock_prices', 'year_chg', {
			type: Sequelize.DECIMAL,
			allowNull: false,
		})
	},
}
