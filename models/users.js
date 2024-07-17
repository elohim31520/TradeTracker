'use strict';
const { Model } = require('sequelize');
const TechNews = require('./techNews')

module.exports = (sequelize, DataTypes) => {
	class Users extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			models.Users.belongsToMany(TechNews, { through: models.pk_user_technews, foreignKey: 'userId' });
			TechNews.belongsToMany(models.Users, { through: models.pk_user_technews, foreignKey: 'newsId' });
		}
	}
	Users.init({
		user_name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		pwd: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		salt: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		sequelize,
		modelName: 'Users',
	});
	return Users;
};