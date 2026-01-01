'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. 先把 company_id 改為 NOT NULL (確保資料完整性)
    // 注意：執行此步前，請確認所有 transactions 都有對應到 company_id
    await queryInterface.changeColumn('transactions', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // 2. 移除舊的 stock_id 欄位
    await queryInterface.removeColumn('transactions', 'stock_id');
  },

  down: async (queryInterface, Sequelize) => {
    // 回滾邏輯：還原欄位
    await queryInterface.addColumn('transactions', 'stock_id', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // 將資料還原回去 (從 company 表把 symbol 抓回來填入 stock_id)
    await queryInterface.sequelize.query(`
      UPDATE transactions t
      JOIN company c ON t.company_id = c.id
      SET t.stock_id = c.symbol
    `);

    // 將 company_id 改回可為 NULL
    await queryInterface.changeColumn('transactions', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};