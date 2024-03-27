'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class market_index extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	market_index.init(
		{
			symbol: DataTypes.STRING,
			price: DataTypes.FLOAT,
			change: DataTypes.FLOAT,
			volatility: DataTypes.FLOAT,
		},
		{
			sequelize,
			modelName: 'market_index',
		}
	)
	return market_index
}
