'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Users extends Model {
		static associate(models) {
			// 用戶發表的評論
			models.Users.hasMany(models.Comments, {
				foreignKey: 'userId',
				as: 'comments',
			})

			// 用戶收到的評論
			models.Users.hasMany(models.Comments, {
				foreignKey: 'toUserId',
				as: 'receivedComments',
			})

			models.Users.hasOne(models.Admin, {
				foreignKey: 'userId',
				as: 'admin',
			})

			models.Users.hasMany(models.UserThirdpartyAccount, {
				foreignKey: 'userId',
				as: 'thirdpartyAccounts',
			})
		}
	}
	Users.init(
		{
			user_name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			pwd: {
				type: DataTypes.STRING,
				allowNull: true,  // 允許為空，因為 Google 登入的用戶不需要密碼
			},
			salt: {
				type: DataTypes.STRING,
				allowNull: true,  // 允許為空，因為 Google 登入的用戶不需要 salt
			},
		},
		{
			sequelize,
			modelName: 'Users',
			tableName: 'Users',
		}
	)
	return Users
}
