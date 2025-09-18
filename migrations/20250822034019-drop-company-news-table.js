'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.dropTable('company_news')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.createTable('company_news', {
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
			company_name: {
				type: Sequelize.STRING,
				references: {
					model: 'company',
					key: 'name',
				},
				onUpdate: 'CASCADE',
			},
			release_time: {
				type: Sequelize.DATE,
			},
			publisher: {
				type: Sequelize.STRING,
			},
			web_url: {
				type: Sequelize.STRING,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		})
	},
}
