'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction()
		try {
			// First, remove the '%' sign from the existing data.
			await queryInterface.sequelize.query('UPDATE stock_prices SET dayChg = REPLACE(dayChg, "%", "")', { transaction })
			await queryInterface.sequelize.query('UPDATE stock_prices SET yearChg = REPLACE(yearChg, "%", "")', {
				transaction,
			})

			// Then, change the column type to DECIMAL.
			await queryInterface.changeColumn(
				'stock_prices',
				'dayChg',
				{
					type: Sequelize.DECIMAL(10, 2),
				},
				{ transaction }
			)

			await queryInterface.changeColumn(
				'stock_prices',
				'yearChg',
				{
					type: Sequelize.DECIMAL(10, 2),
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
		const transaction = await query.sequelize.transaction()
		try {
			// When reverting, we change the type back to STRING.
			// Note: This does not add the '%' symbol back to the data.
			await queryInterface.changeColumn(
				'stock_prices',
				'dayChg',
				{
					type: Sequelize.STRING,
				},
				{ transaction }
			)

			await queryInterface.changeColumn(
				'stock_prices',
				'yearChg',
				{
					type: Sequelize.STRING,
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
