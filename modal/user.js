const sequelize = require("../js/connect");
const { DataTypes } = require("sequelize");

const Users = sequelize.define("Users", {
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    md5 : {
        type: DataTypes.STRING,
    },
    loginId : {
        type: DataTypes.STRING,
    },
    pass_word : {
        type: DataTypes.STRING,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt :{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Users