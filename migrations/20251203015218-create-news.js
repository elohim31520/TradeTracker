'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('News', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: '內容',
      },
      content_en: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '英文版內容',
      },
      status: {
        type: Sequelize.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft',
        allowNull: false,
        comment: '狀態'
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '發布時間'
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: '瀏覽次數'
      },
      is_top: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: '是否置頂'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('News');
  }
};