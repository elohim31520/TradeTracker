'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. 先建立新的唯一索引 (user_id + company_id)
    // 這樣 MySQL 會發現 user_id 已經有新索引支持了，就不會攔著你刪舊的
    await queryInterface.addIndex('portfolios', ['user_id', 'company_id'], {
      unique: true,
      name: 'unique_user_company'
    });

    // 2. 現在可以安全地刪除舊的唯一索引了
    await queryInterface.removeIndex('portfolios', 'unique_user_stock');

    // 3. 最後移除舊的 stock_id 欄位
    await queryInterface.removeColumn('portfolios', 'stock_id');
  },

  down: async (queryInterface, Sequelize) => {
    // 回滾邏輯：先加回欄位，再換回索引
    await queryInterface.addColumn('portfolios', 'stock_id', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addIndex('portfolios', ['user_id', 'stock_id'], {
      unique: true,
      name: 'unique_user_stock'
    });

    await queryInterface.removeIndex('portfolios', 'unique_user_company');
  }
};