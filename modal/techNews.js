const sequelize = require("../js/connect");
const { DataTypes } = require("sequelize");

const model = sequelize.define("TechNews", {
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
	title : {
        type: DataTypes.STRING,
		allowNull: false,
    },
    release_time : {
        type: DataTypes.STRING,
    },
    publisher : {
        type: DataTypes.STRING,
    },
    web_url : {
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

module.exports = model