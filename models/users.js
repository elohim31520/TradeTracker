'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Users extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// 多對多關聯1
			// 多對多關聯1
			// Users.belongsToMany(models.Company, { through: models.User_subscribe_company, foreignKey: 'userId' });
			// models.Company.belongsToMany(Users, { through: models.User_subscribe_company, foreignKey: 'symbol' });

			// 多對多關聯2
			// Users.belongsToMany(models.News, { through: models.User_favorite_news, foreignKey: 'userId' });
			// models.News.belongsToMany(Users, { through: models.User_favorite_news, foreignKey: 'newsId' });

			// 多對多關聯3
			// Users.belongsToMany(models.TechNews, { through: models.pk_user_technews, foreignKey: 'userId' });
			// models.TechNews.belongsToMany(Users, { through: models.pk_user_technews, foreignKey: 'newsId' });
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