'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class UserThirdpartyAccount extends Model {
		static associate(models) {
			UserThirdpartyAccount.belongsTo(models.Users, {
				foreignKey: 'userId',
				as: 'user',
			})
		}
	}
	UserThirdpartyAccount.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				field: 'user_id',
			},
			provider: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			providerUserId: {
				type: DataTypes.STRING,
				allowNull: false,
				field: 'provider_user_id',
			},
			refreshToken: {
				type: DataTypes.STRING,
				allowNull: true,
				field: 'refresh_token',
			},
			accessToken: {
				type: DataTypes.STRING,
				allowNull: true,
				field: 'access_token',
			},
			accessTokenExpiresAt: {
				type: DataTypes.DATE,
				allowNull: true,
				field: 'access_token_expires_at',
			},
		},
		{
			sequelize,
			modelName: 'UserThirdpartyAccount',
			tableName: 'user_thirdparty_accounts',
			underscored: true,
		}
	)
	return UserThirdpartyAccount
}
