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
			price: DataTypes.DECIMAL(10, 2),
			dayChg: DataTypes.DECIMAL,
			yearChg: {
				type: DataTypes.DECIMAL,
				allowNull: true,
			},
			MCap: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			date: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			timestamp: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			// 新增 weight 屬性
			weight: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: true,
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
