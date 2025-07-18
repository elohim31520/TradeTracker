'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('stock_prices', 'timestamp', {
			type: Sequelize.STRING,
			allowNull: true,
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('stock_prices', 'timestamp', {
			type: Sequelize.DATE,
			allowNull: true,
		})
	},
}
