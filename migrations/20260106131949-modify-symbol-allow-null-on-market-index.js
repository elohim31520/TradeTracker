'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('market_index', 'symbol', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 復原時，將其設回不允許為空
    // 注意：如果此時表內已有 NULL 資料，執行 down 會報錯，需先處理數據
    await queryInterface.changeColumn('market_index', 'symbol', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};