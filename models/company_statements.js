'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class company_statements extends Model {
		static associate(models) {
		}
	}
	company_statements.init({
		symbo: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: DataTypes.DECIMAL(10, 2),
		PE_Trailing: DataTypes.DECIMAL(10, 2),
		PE_Forward: DataTypes.DECIMAL(10, 2),
		EPS_Trailing: DataTypes.DECIMAL(10, 2),
		EPS_Forward: DataTypes.DECIMAL(10, 2),
		volume: DataTypes.INTEGER,
		marketCap: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'company_statements',
		tableName: 'company_statements',
	});
	return company_statements;
};