'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Comments', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			content: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '評論內容',
			},
			postId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'tech_investment_news',
					key: 'id',
				},
				comment: '新聞id',
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
				comment: '評論用戶id',
			},
			toUserId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'Users',
					key: 'id',
				},
				comment: '被評論用戶id',
			},
			parentId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'Comments',
					key: 'id',
				},
				comment: '父評論id',
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
		await queryInterface.dropTable('Comments')
	},
}
