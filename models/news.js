'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class News extends Model {
		static associate(models) {}
	}
	News.init(
		{
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM('draft', 'published', 'archived'),
				defaultValue: 'draft',
				allowNull: false,
			},
            publishedAt: {
                type: DataTypes.DATE,
                allowNull: true,
              },
			viewCount: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			isTop: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'News',
			tableName: 'News',
			underscored: true,
			timestamps: true,
		}
	)
	return News
}
