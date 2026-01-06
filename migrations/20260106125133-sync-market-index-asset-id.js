'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // MySQL 的多表更新語法：UPDATE 表1 JOIN 表2 ON 條件 SET 賦值
    await queryInterface.sequelize.query(`
      UPDATE market_index
      JOIN assets ON market_index.symbol = assets.symbol
      SET market_index.asset_id = assets.id;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // 復原邏輯保持不變
    await queryInterface.sequelize.query(`
      UPDATE market_index SET asset_id = NULL;
    `);
  }
};