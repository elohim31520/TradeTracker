const sequelize = require("../../js/connect");
const { DataTypes } = require("sequelize");

const model = sequelize.define("User_favorite_news", {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
		primaryKey: true,
    },
	newsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
		primaryKey: true,
    }
}, {
	tableName: 'User_favorite_news',
	timestamps: false
});

module.exports = model