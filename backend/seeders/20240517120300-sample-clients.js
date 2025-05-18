"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Clients', [
      {
        name: 'Acme Corp',
        contact: 'John Manager',
        email: 'contact@acme.com',
        contract: '2024-2025',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Beta Ltd',
        contact: 'Jane Director',
        email: 'info@beta.com',
        contract: '2023-2024',
        status: 'Expired',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Clients', null, {});
  }
}; 