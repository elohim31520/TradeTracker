'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('stock_prices', 'date', {
			type: Sequelize.STRING(32),
			allowNull: false,
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('stock_prices', 'date', {
			type: Sequelize.DATE,
			allowNull: false,
		})
	},
}
