'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class pk_user_technews extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	pk_user_technews.init({
		userId: DataTypes.STRING,
		newsId: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'pk_user_technews',
	});
	return pk_user_technews;
};