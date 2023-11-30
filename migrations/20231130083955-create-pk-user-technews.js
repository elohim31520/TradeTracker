'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('pk_user_technews', {
			userId: {
				type: Sequelize.STRING,
				allowNull: false,
				primaryKey: true,
			},
			newsId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('pk_user_technews');
	}
};