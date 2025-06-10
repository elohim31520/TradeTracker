'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('StockPrices', 'date', {
			type: Sequelize.STRING(32),
			allowNull: false,
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('StockPrices', 'date', {
			type: Sequelize.DATE,
			allowNull: false,
		})
	},
}
