'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
		static associate(models) {
			Comment.belongsTo(models.Users, {
				foreignKey: 'userId',
				as: 'author',
			})
			Comment.belongsTo(models.Users, {
				foreignKey: 'toUserId',
				as: 'toUser',
			})
			Comment.belongsTo(models.Comments, {
				foreignKey: 'parentId',
				as: 'parent',
			})
			Comment.belongsTo(models.tech_investment_news, {
				foreignKey: 'postId',
				as: 'newsPost',
			})
		}
	}
	Comment.init(
		{
			content: DataTypes.STRING,
			postId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'CompanyNews',
					key: 'id',
				},
				comment: '新聞id',
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
				comment: '評論用戶id',
			},
			toUserId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'Users',
					key: 'id',
				},
				comment: '被評論用戶id',
			},
			parentId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: '父評論id',
				references: {
					model: 'Comments',
					key: 'id',
				},
			},
		},
		{
			sequelize,
			modelName: 'Comments',
			tableName: 'Comments',
		}
	)
	return Comment
}
