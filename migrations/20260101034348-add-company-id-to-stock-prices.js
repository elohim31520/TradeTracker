'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('stock_prices', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'company',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addIndex('stock_prices', ['company_id']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('stock_prices', 'company_id');
    await queryInterface.removeIndex('stock_prices', ['company_id']);
  }
};
