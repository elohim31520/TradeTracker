'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('company_statements', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			symbo: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			price: {
				type: Sequelize.DECIMAL
			},
			PE_Trailing: {
				type: Sequelize.DECIMAL
			},
			PE_Forward: {
				type: Sequelize.DECIMAL
			},
			EPS_Trailing: {
				type: Sequelize.DECIMAL
			},
			EPS_Forward: {
				type: Sequelize.DECIMAL
			},
			volume: {
				type: Sequelize.INTEGER
			},
			marketCap: {
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('company_statements');
	}
};