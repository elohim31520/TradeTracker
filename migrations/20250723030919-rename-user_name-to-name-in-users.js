'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameTable('Users', 'users')
		await queryInterface.renameColumn('users', 'user_name', 'name')
		await queryInterface.renameColumn('users', 'createdAt', 'created_at')
		await queryInterface.renameColumn('users', 'updatedAt', 'updated_at')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameTable('users', 'Users')
		await queryInterface.renameColumn('Users', 'name', 'user_name')
		await queryInterface.renameColumn('Users', 'created_at', 'createdAt')
		await queryInterface.renameColumn('Users', 'updated_at', 'updatedAt')
	},
}
