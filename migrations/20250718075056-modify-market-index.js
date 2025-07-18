'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// 1. 將時間戳記欄位從駝峰式命名改為蛇形命名
		await queryInterface.renameColumn('market_index', 'createdAt', 'created_at')
		await queryInterface.renameColumn('market_index', 'updatedAt', 'updated_at')

		// 2. 修改時間戳記欄位屬性，加入 defaultValue
		await queryInterface.changeColumn('market_index', 'created_at', {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		})
		await queryInterface.changeColumn('market_index', 'updated_at', {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		})

		// 3. 移除 volatility 欄位
		await queryInterface.removeColumn('market_index', 'volatility')
	},

	async down(queryInterface, Sequelize) {
		// 1. 恢復 volatility 欄位
		await queryInterface.addColumn('market_index', 'volatility', {
			type: Sequelize.FLOAT,
			allowNull: true,
		})

		// 2. 恢復時間戳記欄位屬性，移除 defaultValue
		await queryInterface.changeColumn('market_index', 'created_at', {
			type: Sequelize.DATE,
			allowNull: false,
		})
		await queryInterface.changeColumn('market_index', 'updated_at', {
			type: Sequelize.DATE,
			allowNull: false,
		})

		// 3. 將時間戳記欄位名稱還原為駝峰式命名
		await queryInterface.renameColumn('market_index', 'created_at', 'createdAt')
		await queryInterface.renameColumn('market_index', 'updated_at', 'updatedAt')
	},
}
