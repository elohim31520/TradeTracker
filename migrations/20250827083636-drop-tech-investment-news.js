'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.dropTable('comments');
		await queryInterface.dropTable('tech_investment_news');
	},

	async down(queryInterface, Sequelize) {
		// Recreate tech_investment_news table first
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
		});
		
		// Then recreate comments table as it was, assuming its original definition
		// This part should ideally match the 'up' method of '20250520024535-create-comment.js'
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
			},
			postId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'tech_investment_news',
					key: 'id',
				},
				onDelete: 'CASCADE'
			},
			author_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			// ... assuming other columns like toUserId, parent_id etc. were here
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
};
