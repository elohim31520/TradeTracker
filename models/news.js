const sequelize = require("../js/connect");
const { DataTypes } = require("sequelize");

const News = sequelize.define("News", {
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    md5 : {
        type: DataTypes.STRING,
    },
    release_time : {
        type: DataTypes.STRING,
    },
    company: {
        type: DataTypes.STRING,
    },
    title : {
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

module.exports = News