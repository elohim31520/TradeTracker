const sequelize = require("../js/connect");
const { DataTypes } = require("sequelize");

const Company = sequelize.define("Company", {
	symbol: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNll: true
	}
}, {
	tableName: 'Company',
	timestamps: false
});

module.exports = Company