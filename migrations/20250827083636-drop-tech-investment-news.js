'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.dropTable('tech_investment_news')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.createTable('tech_investment_news', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			release_time: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			publisher: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			web_url: {
				type: Sequelize.STRING,
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
}
