'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('market_index', 'asset_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // 先允許為空，以免舊數據報錯
      references: {
        model: 'assets',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('market_index', 'asset_id');
  }
};