'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Users extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			models.Users.belongsToMany(models.tech_investment_news, {
				through: models.pk_user_technews,
				foreignKey: 'userId',
			})
			models.tech_investment_news.belongsToMany(models.Users, {
				through: models.pk_user_technews,
				foreignKey: 'newsId',
			})

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
				allowNull: false,
			},
			salt: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Users',
		}
	)
	return Users
}
