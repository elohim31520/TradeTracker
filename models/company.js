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
		Company.hasMany(models.Portfolio, { foreignKey: 'stock_id', sourceKey: 'symbol' })
	}
	return Company
}
