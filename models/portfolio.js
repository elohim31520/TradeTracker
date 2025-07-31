'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Portfolio extends Model {
		static associate(models) {
			Portfolio.belongsTo(models.Users, { foreignKey: 'user_id' })
			Portfolio.belongsTo(models.Company, { foreignKey: 'stock_id', targetKey: 'symbol', as: 'company' })
		}
	}
	Portfolio.init(
		{
			user_id: DataTypes.INTEGER,
			stock_id: DataTypes.STRING,
			quantity: DataTypes.INTEGER,
			average_price: DataTypes.DECIMAL(10, 2),
		},
		{
			sequelize,
			modelName: 'Portfolio',
			tableName: 'Portfolios',
			uniqueKeys: {
				unique_user_stock: {
					fields: ['user_id', 'stock_id'],
				},
			},
		}
	)
	return Portfolio
}
