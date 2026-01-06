'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('market_index', 'symbol');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('market_index', 'symbol', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};