const sequelize = require("../js/connect");
const { DataTypes } = require("sequelize");

const Records = sequelize.define("Records", {
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
    share : {
        type: DataTypes.DECIMAL,
    },
    price: {
        type: DataTypes.DECIMAL,
    },
    dividend : {
        type: DataTypes.DECIMAL,
    },
    total : {
        type: DataTypes.DECIMAL,
    },
    company : {
        type: DataTypes.STRING,
        allowNull: false
    },
    open_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
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

module.exports = Records