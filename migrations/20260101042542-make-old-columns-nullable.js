'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 將舊有的 company 欄位改為允許 NULL
    await queryInterface.changeColumn('stock_prices', 'company', {
      type: Sequelize.STRING,
      allowNull: true // 關鍵：改為 true
    });

    // 建議連同 symbol 也一起改，因為以後也用不到這個重複的字串了
    await queryInterface.changeColumn('stock_prices', 'symbol', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // 復原時改回 false (注意：如果資料庫已有 NULL 值，這步可能會報錯)
    await queryInterface.changeColumn('stock_prices', 'company', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('stock_prices', 'symbol', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};