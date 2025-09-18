'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('admins', 'createdAt', {
			allowNull: false,
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW,
		})
		await queryInterface.changeColumn('admins', 'updatedAt', {
			allowNull: false,
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW,
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('admins', 'createdAt', {
			allowNull: true,
			type: Sequelize.DATE,
			defaultValue: null,
		})
		await queryInterface.changeColumn('admins', 'updatedAt', {
			allowNull: true,
			type: Sequelize.DATE,
			defaultValue: null,
		})
	},
}
