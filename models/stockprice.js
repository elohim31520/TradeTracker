'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class StockPrice extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	StockPrice.init(
		{
			symbol: DataTypes.STRING,
			company: DataTypes.STRING,
			price: DataTypes.DECIMAL,
			dayChg: DataTypes.STRING,
			yearChg: DataTypes.STRING,
			MCap: DataTypes.STRING,
			date: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'StockPrice',
		}
	)
	return StockPrice
}
