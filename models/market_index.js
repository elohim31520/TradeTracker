'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class MarketIndex extends Model {
		static associate(models) {
            MarketIndex.belongsTo(models.Asset, {
                foreignKey: 'asset_id',
                as: 'asset'
            })
        }
	}
	MarketIndex.init(
		{
			symbol: DataTypes.STRING,
			price: DataTypes.FLOAT,
			change: DataTypes.FLOAT,
			asset_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
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
