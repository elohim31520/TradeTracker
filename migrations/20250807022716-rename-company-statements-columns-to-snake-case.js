'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameColumn('company_statements', 'symbo', 'symbol')
		await queryInterface.renameColumn('company_statements', 'PE_Trailing', 'pe_trailing')
		await queryInterface.renameColumn('company_statements', 'PE_Forward', 'pe_forward')
		await queryInterface.renameColumn('company_statements', 'EPS_Trailing', 'eps_trailing')
		await queryInterface.renameColumn('company_statements', 'EPS_Forward', 'eps_forward')
		await queryInterface.renameColumn('company_statements', 'marketCap', 'market_cap')
		await queryInterface.renameColumn('company_statements', 'createdAt', 'created_at')
		await queryInterface.renameColumn('company_statements', 'updatedAt', 'updated_at')

		// 2. 修改時間戳記欄位屬性，加入 defaultValue
		await queryInterface.changeColumn('company_statements', 'created_at', {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		})
		await queryInterface.changeColumn('company_statements', 'updated_at', {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		})

	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameColumn('company_statements', 'symbol', 'symbo')
		await queryInterface.renameColumn('company_statements', 'pe_trailing', 'PE_Trailing')
		await queryInterface.renameColumn('company_statements', 'pe_forward', 'PE_Forward')
		await queryInterface.renameColumn('company_statements', 'eps_trailing', 'EPS_Trailing')
		await queryInterface.renameColumn('company_statements', 'eps_forward', 'EPS_Forward')
		await queryInterface.renameColumn('company_statements', 'market_cap', 'marketCap')

		// 2. 恢復時間戳記欄位屬性，移除 defaultValue
		await queryInterface.changeColumn('company_statements', 'created_at', {
			type: Sequelize.DATE,
			allowNull: false,
		})
		await queryInterface.changeColumn('company_statements', 'updated_at', {
			type: Sequelize.DATE,
			allowNull: false,
		})

		// 3. 將時間戳記欄位名稱還原為駝峰式命名
		await queryInterface.renameColumn('company_statements', 'created_at', 'createdAt')
		await queryInterface.renameColumn('company_statements', 'updated_at', 'updatedAt')
	},
}
