"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Assets', [
      {
        name: 'Vehicle A',
        type: 'Car',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Radio B',
        type: 'Radio',
        status: 'Maintenance',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Assets', null, {});
  }
}; 