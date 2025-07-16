'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Users', 'googleId')
		await queryInterface.removeColumn('Users', 'provider')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.addColumn('Users', 'googleId', {
			type: Sequelize.STRING,
			allowNull: true,
			unique: true,
		})
		await queryInterface.addColumn('Users', 'provider', {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: 'local',
		})
	},
}
