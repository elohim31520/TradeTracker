'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. 新增 company_id 欄位 (先允許 NULL)
    await queryInterface.addColumn('portfolios', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'company',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // 2. 資料遷移：根據 stock_id (代號) 對應到 company.id
    await queryInterface.sequelize.query(`
      UPDATE portfolios p
      JOIN company c ON p.stock_id = c.symbol
      SET p.company_id = c.id
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('portfolios', 'company_id');
  }
};