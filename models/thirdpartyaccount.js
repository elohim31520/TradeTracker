'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class ThirdpartyAccount extends Model {
		static associate(models) {
			ThirdpartyAccount.belongsTo(models.Users, {
				foreignKey: 'userId',
				as: 'user',
			})
		}
	}
	ThirdpartyAccount.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			provider: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			providerUserId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			refreshToken: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			accessToken: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			accessTokenExpiresAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: 'ThirdpartyAccount',
			tableName: 'ThirdpartyAccounts'
		}
	)
	return ThirdpartyAccount
} 