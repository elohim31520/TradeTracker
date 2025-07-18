'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Admin extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
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
			tableName: 'Admins',
		}
	)
	return Admin
}
