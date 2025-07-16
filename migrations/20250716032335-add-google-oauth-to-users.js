'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction()

		try {
			await queryInterface.addColumn(
				'Users',
				'googleId',
				{
					type: Sequelize.STRING,
					allowNull: true,
					unique: true,
				},
				{ transaction }
			)

			await queryInterface.addColumn(
				'Users',
				'provider',
				{
					type: Sequelize.STRING,
					allowNull: true,
					defaultValue: 'local',
				},
				{ transaction }
			)

			// 修改現有欄位
			await queryInterface.changeColumn(
				'Users',
				'pwd',
				{
					type: Sequelize.STRING,
					allowNull: true,
				},
				{ transaction }
			)

			await queryInterface.changeColumn(
				'Users',
				'salt',
				{
					type: Sequelize.STRING,
					allowNull: true,
				},
				{ transaction }
			)

			await transaction.commit()
		} catch (err) {
			await transaction.rollback()
			throw err
		}
	},

	async down(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction()

		try {
			await queryInterface.removeColumn('Users', 'googleId', { transaction })
			await queryInterface.removeColumn('Users', 'provider', { transaction })

			await queryInterface.changeColumn(
				'Users',
				'pwd',
				{
					type: Sequelize.STRING,
					allowNull: false,
				},
				{ transaction }
			)

			await queryInterface.changeColumn(
				'Users',
				'salt',
				{
					type: Sequelize.STRING,
					allowNull: false,
				},
				{ transaction }
			)

			await transaction.commit()
		} catch (err) {
			await transaction.rollback()
			throw err
		}
	},
}
