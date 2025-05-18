'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First check if the Users table exists
    const tables = await queryInterface.showAllTables();
    if (tables.includes('Users')) {
      await queryInterface.addColumn('Users', 'status', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'active'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // First check if the Users table exists
    const tables = await queryInterface.showAllTables();
    if (tables.includes('Users')) {
      await queryInterface.removeColumn('Users', 'status');
    }
  }
}; 