const sequelize = require("../js/connect");
const { DataTypes } = require("sequelize");

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

module.exports = Users