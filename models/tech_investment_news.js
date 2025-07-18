'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class tech_investment_news extends Model {
		static associate(models) {
			tech_investment_news.hasMany(models.Comments, {
				foreignKey: 'postId',
				as: 'comments'
			})
		}
	}
	tech_investment_news.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			release_time: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			publisher: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			web_url: {
				type: DataTypes.STRING,
			},
			createdAt: {
				type: DataTypes.DATE,
			},
			updatedAt: {
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			modelName: 'tech_investment_news',
			tableName: 'tech_investment_news',
		}
	)
	return tech_investment_news
}
