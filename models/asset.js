'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Asset extends Model {
        static associate(models) {
            // 一個資產擁有多條價格歷史紀錄
            Asset.hasMany(models.MarketIndex, {
                foreignKey: 'assetId',
                as: 'priceHistories',
            })
        }
    }
    Asset.init(
        {
            symbol: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            base_asset: DataTypes.STRING,
            quote_asset: DataTypes.STRING,
            decimal_places: {
                type: DataTypes.INTEGER,
                defaultValue: 2,
            },
        },
        {
            sequelize,
            modelName: 'Asset',
            tableName: 'assets',
            underscored: true
        }
    )
    return Asset
}