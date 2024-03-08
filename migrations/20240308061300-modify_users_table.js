'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		return Promise.all([
			queryInterface.addColumn('users', 'pwd', {
				type: Sequelize.STRING,
				allowNull: false,
			}),
			queryInterface.addColumn('users', 'salt', {
				type: Sequelize.STRING,
				allowNull: false,
			}),
		])
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	}
};
