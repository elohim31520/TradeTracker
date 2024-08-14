'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class CompanyNews extends Model {
		static associate(models) {
			CompanyNews.belongsTo(models.Company, {
				foreignKey: 'company_id',
				as: 'Company',
			})
		}
	}
	CompanyNews.init(
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
				unique: true
			},
			company_id: {
				type: DataTypes.INTEGER,
				references: {
					model: 'Company',
					key: 'id',
				},
			},
			release_time: {
				type: DataTypes.DATE,
			},
			publisher: {
				type: DataTypes.STRING,
			},
			web_url: {
				type: DataTypes.STRING,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'CompanyNews',
			tableName: 'company_news',
			timestamps: true,
		}
	)
	return CompanyNews
}
