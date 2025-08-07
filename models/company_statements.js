'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class CompanyStatement extends Model {
		static associate(models) {
		}
	}
	CompanyStatement.init({
		symbol: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: DataTypes.DECIMAL(10, 2),
		peTrailing: DataTypes.DECIMAL(10, 2),
		peForward: DataTypes.DECIMAL(10, 2),
		epsTrailing: DataTypes.DECIMAL(10, 2),
		epsForward: DataTypes.DECIMAL(10, 2),
		volume: DataTypes.INTEGER,
		marketCap: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'CompanyStatement',
		tableName: 'company_statements',
		underscored: true,
	});
	return CompanyStatement;
};