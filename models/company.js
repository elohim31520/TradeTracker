'use strict'
module.exports = (sequelize, DataTypes) => {
	const Company = sequelize.define(
		'Company',
		{
			symbol: {
				type: DataTypes.STRING,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			tableName: 'Company',
			freezeTableName: true, // 防止 Sequelize 自动修改表名称（如添加复数形式）
		}
	)
	Company.associate = function (models) {
		Company.hasMany(models.Portfolio, { foreignKey: 'stock_id', sourceKey: 'symbol' })
	}
	return Company
}
