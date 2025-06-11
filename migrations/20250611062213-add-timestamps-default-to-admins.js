'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('Admins', 'createdAt', {
			allowNull: false,
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW,
		})
		await queryInterface.changeColumn('Admins', 'updatedAt', {
			allowNull: false,
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW,
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('Admins', 'createdAt', {
			allowNull: true,
			type: Sequelize.DATE,
			defaultValue: null,
		})
		await queryInterface.changeColumn('Admins', 'updatedAt', {
			allowNull: true,
			type: Sequelize.DATE,
			defaultValue: null,
		})
	},
}
