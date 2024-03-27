'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class btcusd extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	btcusd.init(
		{
			price: DataTypes.FLOAT,
			change: DataTypes.FLOAT,
			volatility: DataTypes.FLOAT,
		},
		{
			sequelize,
			modelName: 'btcusd',
		}
	)
	return btcusd
}
