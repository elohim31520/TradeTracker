'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class StockPrice extends Model {
		static associate(models) {
		}
	}
	StockPrice.init(
		{
			symbol: DataTypes.STRING,
			company: DataTypes.STRING,
			price: DataTypes.DECIMAL,
			dayChg: DataTypes.DECIMAL,
			yearChg: DataTypes.DECIMAL,
			MCap: DataTypes.STRING,
			date: DataTypes.STRING,
			timestamp: {
				type: DataTypes.DATE,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			tableName: 'stock_prices',
			modelName: 'StockPrice',
			underscored: true,
		}
	)
	return StockPrice
}
