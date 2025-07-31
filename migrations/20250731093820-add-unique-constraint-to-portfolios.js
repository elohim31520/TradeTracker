'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addConstraint('Portfolios', {
			fields: ['user_id', 'stock_id'],
			type: 'unique',
			name: 'unique_user_stock',
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint('Portfolios', 'unique_user_stock')
	},
}
