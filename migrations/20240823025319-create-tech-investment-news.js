'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('tech_investment_news', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
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
				allowNull: true,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('tech_investment_news')
	},
}
