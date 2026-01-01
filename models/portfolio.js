'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Portfolio extends Model {
        static associate(models) {
            // 1. 維持與 Users 的關聯
            Portfolio.belongsTo(models.Users, { foreignKey: 'user_id' })
            
            Portfolio.belongsTo(models.Company, { 
                foreignKey: 'company_id', 
                as: 'company' 
            })
        }
    }

    Portfolio.init(
        {
            user_id: DataTypes.INTEGER,
            company_id: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            average_price: DataTypes.DECIMAL(10, 2),
        },
        {
            sequelize,
            modelName: 'Portfolio',
            tableName: 'portfolios',
            // 4. 更新唯一索引名稱與欄位，與你最後一個 Migration 保持一致
            uniqueKeys: {
                unique_user_company: {
                    fields: ['user_id', 'company_id'],
                },
            },
        }
    )
    return Portfolio
}