'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class company_statements extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	company_statements.init({
		symbo: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: DataTypes.DECIMAL,
		PE_Trailing: DataTypes.DECIMAL,
		PE_Forward: DataTypes.DECIMAL,
		EPS_Trailing: DataTypes.DECIMAL,
		EPS_Forward: DataTypes.DECIMAL,
		volume: DataTypes.INTEGER,
		marketCap: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'company_statements',
	});
	return company_statements;
};