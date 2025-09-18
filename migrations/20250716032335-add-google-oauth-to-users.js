'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction()

		try {
			await queryInterface.addColumn(
				'users',
				'googleId',
				{
					type: Sequelize.STRING,
					allowNull: true,
					unique: true,
				},
				{ transaction }
			)

			await queryInterface.addColumn(
				'users',
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
				'users',
				'pwd',
				{
					type: Sequelize.STRING,
					allowNull: true,
				},
				{ transaction }
			)

			await queryInterface.changeColumn(
				'users',
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
			await queryInterface.removeColumn('users', 'googleId', { transaction })
			await queryInterface.removeColumn('users', 'provider', { transaction })

			await queryInterface.changeColumn(
				'users',
				'pwd',
				{
					type: Sequelize.STRING,
					allowNull: false,
				},
				{ transaction }
			)

			await queryInterface.changeColumn(
				'users',
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
