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
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'userId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE'
			}
		},
		newsId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'tech_investment_news',
				key: 'id',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE'
			}
		}
	}, {
		sequelize,
		modelName: 'pk_user_technews',
		tableName: 'pk_user_technews',
	});
	pk_user_technews.removeAttribute('id')
	return pk_user_technews;
};