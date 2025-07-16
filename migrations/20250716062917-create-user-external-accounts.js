'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('ThirdpartyAccounts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
			provider: {
				type: Sequelize.STRING(50),
				allowNull: false,
			},
			providerUserId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			refreshToken: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			accessToken: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			accessTokenExpiresAt: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
			},
		})

		await queryInterface.addConstraint('ThirdpartyAccounts', {
			fields: ['provider', 'providerUserId'],
			type: 'unique',
			name: 'unique_provider_user',
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('ThirdpartyAccounts')
	},
}
