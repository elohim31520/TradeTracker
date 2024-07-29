'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface
			.changeColumn('transactions', 'createdAt', {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			})
			.then(() => {
				return queryInterface.changeColumn('transactions', 'updatedAt', {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				})
			})
	},

	async down(queryInterface, Sequelize) {
		return queryInterface
			.changeColumn('transactions', 'createdAt', {
				type: Sequelize.DATE,
				allowNull: false,
			})
			.then(() => {
				return queryInterface.changeColumn('transactions', 'updatedAt', {
					type: Sequelize.DATE,
					allowNull: false,
				})
			})
	},
}
