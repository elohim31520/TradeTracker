const sequelize = require("../../js/connect");
const { DataTypes } = require("sequelize");

const SellRecords = sequelize.define("Sell_Records", {
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
        type: DataTypes.DECIMAL(10,2),
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
    },
    total : {
        type: DataTypes.DECIMAL(10,2),
    },
    profit: {
        type: DataTypes.DECIMAL(10,2),
    },
    company : {
        type: DataTypes.STRING,
        allowNull: false
    },
    close_time: {
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

module.exports = SellRecords