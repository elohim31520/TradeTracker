'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('StockPrices', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			symbol: {
				type: Sequelize.STRING,
			},
			company: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			price: {
				type: Sequelize.DECIMAL,
				allowNull: false,
			},
			dayChg: {
				type: Sequelize.STRING,
			},
			yearChg: {
				type: Sequelize.STRING,
			},
			MCap: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			date: {
				type: Sequelize.DATE,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('StockPrices')
	},
}
