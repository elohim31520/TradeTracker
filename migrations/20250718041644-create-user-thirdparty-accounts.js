'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('user_thirdparty_accounts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
			provider: {
				type: Sequelize.STRING(50),
				allowNull: false,
			},
			provider_user_id: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			refresh_token: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			access_token: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			access_token_expires_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
			},
		});

		await queryInterface.addConstraint('user_thirdparty_accounts', {
			fields: ['provider', 'provider_user_id'],
			type: 'unique',
			name: 'unique_provider_user',
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('user_thirdparty_accounts');
	},
};
