'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.dropTable('Comments')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.createTable('comments', {
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
			author_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'users',
					key: 'id',
				},
				allowNull: false,
				comment: '評論用戶id',
			},
			editor_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			parent_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'comments',
					key: 'id',
				},
			},
			created_at: {
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
