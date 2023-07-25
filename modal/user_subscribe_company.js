const sequelize = require("../js/connect");
const { DataTypes } = require("sequelize");
const Users = require("./user")
const Company = require("./company")

const User_subscribe_company = sequelize.define("User_subscribe_company", {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
		primaryKey: true,
    },
	symbol: {
        type: DataTypes.STRING,
        allowNull: false,
		primaryKey: true,
    }
}, {
	tableName: 'User_subscribe_company',
	timestamps: false
});

Users.belongsToMany(Company, {through: User_subscribe_company, foreignKey: "userId"})
Company.belongsToMany(Users, {through: User_subscribe_company, foreignKey: "symbol"})

module.exports = User_subscribe_company