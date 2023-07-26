const sequelize = require("../js/connect");
const { DataTypes } = require("sequelize");

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

module.exports = User_subscribe_company