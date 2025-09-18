'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Admin extends Model {
		static associate(models) {
			models.Admin.belongsTo(models.Users, {
				foreignKey: 'userId',
				as: 'user',
			})
		}
	}
	Admin.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			modelName: 'Admin',
			tableName: 'admins',
		}
	)
	return Admin
}
