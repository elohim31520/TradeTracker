'use strict'
module.exports = (sequelize, DataTypes) => {
	const Company = sequelize.define(
		'Company',
		{
			symbol: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
	)
	Company.associate = function (models) {
	}
	return Company
}