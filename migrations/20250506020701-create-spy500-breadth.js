'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('spy500_breadth', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
				unique: true,
			},
			breath: {
				type: Sequelize.DOUBLE,
			},
			advancingIssues: {
				type: Sequelize.INTEGER,
			},
			decliningIssues: {
				type: Sequelize.INTEGER,
			},
			unChangedIssues: {
				type: Sequelize.INTEGER,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('spy500_breadth')
	},
}
