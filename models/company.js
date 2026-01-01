'use strict'
module.exports = (sequelize, DataTypes) => {
	const Company = sequelize.define(
		'Company',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			symbol: {
				type: DataTypes.STRING,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			modelName: 'Company',
			tableName: 'company',
		}
	)
	Company.associate = function (models) {
		Company.hasMany(models.Portfolio, { foreignKey: 'company_id', as: 'portfolios' });
		Company.hasMany(models.Transaction, { foreignKey: 'company_id', as: 'transactions' });
	};
	return Company
}
