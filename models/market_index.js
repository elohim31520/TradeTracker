'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class MarketIndex extends Model {
		static associate(models) {

		}
	}
	MarketIndex.init(
		{
			symbol: DataTypes.STRING,
			price: DataTypes.FLOAT,
			change: DataTypes.FLOAT,
		},
		{
			sequelize,
			modelName: 'MarketIndex',
			tableName: 'market_index',
			timestamps: true,
			underscored: true,
		}
	)
	return MarketIndex
}
