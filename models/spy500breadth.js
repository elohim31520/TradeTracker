'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Spy500Breadth extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Spy500Breadth.init(
		{
			date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
				unique: true,
			},
			breath: DataTypes.DOUBLE,
			advancingIssues: DataTypes.INTEGER,
			decliningIssues: DataTypes.INTEGER,
			unChangedIssues: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Spy500Breadth',
			tableName: 'Spy500_breadth',
		}
	)
	return Spy500Breadth
}
