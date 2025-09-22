'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('user_thirdparty_accounts', 'picture', {
			type: Sequelize.STRING,
			allowNull: true,
		})
		await queryInterface.addColumn('user_thirdparty_accounts', 'name', {
			type: Sequelize.STRING,
			allowNull: true,
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('user_thirdparty_accounts', 'picture')
		await queryInterface.removeColumn('user_thirdparty_accounts', 'name')
	},
}
