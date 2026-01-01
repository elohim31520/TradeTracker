module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. 新增 company_id 欄位 (先允許 NULL，因為舊資料還沒填入)
    await queryInterface.addColumn('transactions', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'company',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // 2. 資料遷移：將 transactions.stock_id 對應到 company.id
    // 這是一段 SQL 語法，將 symbol 匹配到的 ID 填入 company_id
    await queryInterface.sequelize.query(`
      UPDATE transactions t
      JOIN company c ON t.stock_id = c.symbol
      SET t.company_id = c.id
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // 將 ID 轉回字串存回 stock_id
    await queryInterface.sequelize.query(`
      UPDATE transactions t
      JOIN company c ON t.company_id = c.id
      SET t.stock_id = c.symbol
    `);

    await queryInterface.removeColumn('transactions', 'company_id');
  }
};