'use strict'
const { Model } = require('sequelize')
const crypto = require('crypto')

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
			contentEn: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			content_hash: {
				type: DataTypes.CHAR(32),
				allowNull: false,
				unique: true,
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
			hooks: {
				beforeValidate: (news) => {
				  if (news.content) {
					const contentToHash = news.content.trim()
					news.content_hash = crypto
					  .createHash('md5')
					  .update(contentToHash)
					  .digest('hex');
				  }
				},
				beforeBulkCreate: (newsList) => {
					newsList.forEach((news) => {
						if (news.content) {
							const contentToHash = news.content.trim();
							news.content_hash = crypto
								.createHash('md5')
								.update(contentToHash)
								.digest('hex');
						}
					});
				}
			}
		}
	)
	return News
}
