'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    await queryInterface.bulkInsert('assets', [
      {
        symbol: 'USOIL',
        base_asset: 'WTI',
        quote_asset: 'USD',
        decimal_places: 3,
        created_at: now,
        updated_at: now
      },
      {
        symbol: 'US10Y',
        base_asset: 'US10Y',
        quote_asset: 'PERCENT',
        decimal_places: 3,
        created_at: now,
        updated_at: now
      },
      {
        symbol: 'XAUUSD',
        base_asset: 'XAU',
        quote_asset: 'USD',
        decimal_places: 2,
        created_at: now,
        updated_at: now
      },
      {
        symbol: 'BTCUSD',
        base_asset: 'BTC',
        quote_asset: 'USD',
        decimal_places: 2,
        created_at: now,
        updated_at: now
      },
      {
        symbol: 'DXY',
        base_asset: 'DXY',
        quote_asset: 'INDEX',
        decimal_places: 3,
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // 刪除所有初始化的資料
    await queryInterface.bulkDelete('assets', null, {});
  }
};