const sequelize = require("../js/connect");
const { DataTypes } = require("sequelize");
const Company = require("./company")
const User_subscribe_company = require("./user_subscribe_company")
const News = require("./news")
const User_favorite_news = require("./many_to_many/user_favorite_news")

const Users = sequelize.define("Users", {
	userId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	md5_userId: {
		type: DataTypes.STRING,
		allowNull: false
	},
	pwd: {
		type: DataTypes.STRING,
		allowNull: false
	},
	salt: {
		type: DataTypes.STRING,
		allowNull: false
	},
	createdAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW
	},
	updatedAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW
	}
});

// 設置多對多關聯
Users.belongsToMany(Company, { through: User_subscribe_company, foreignKey: 'userId' });
Company.belongsToMany(Users, { through: User_subscribe_company, foreignKey: 'symbol' });

Users.belongsToMany(News, { through: User_favorite_news, foreignKey: "userId" })
News.belongsToMany(Users, { through: User_favorite_news, foreignKey: "newsId" })

module.exports = Users