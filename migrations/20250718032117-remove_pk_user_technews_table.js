'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.dropTable('pk_user_technews')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.createTable('pk_user_technews', {
			userId: {
				type: Sequelize.STRING,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			newsId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'tech_investment_news',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
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
