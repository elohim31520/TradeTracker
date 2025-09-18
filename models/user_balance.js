'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class UserBalance extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			UserBalance.belongsTo(models.Users, { foreignKey: 'user_id' })
		}
	}
	UserBalance.init(
		{
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			balance: {
				type: DataTypes.DECIMAL(15, 2),
				allowNull: false,
				defaultValue: 0,
			},
			currency: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'USD',
			},
		},
		{
			sequelize,
			modelName: 'UserBalance',
			tableName: 'user_balances',
			uniqueKeys: {
				user_currency_unique: {
					fields: ['user_id', 'currency'],
				},
			},
			underscored: true,
			timestamps: true,
		}
	)
	return UserBalance
}
