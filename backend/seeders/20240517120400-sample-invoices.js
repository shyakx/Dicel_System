"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Invoices', [
      {
        clientId: 1,
        amount: 2000,
        status: 'Paid',
        dueDate: new Date('2024-06-01'),
        paidDate: new Date('2024-06-01'),
        description: 'Security services for May',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 2,
        amount: 1500,
        status: 'Unpaid',
        dueDate: new Date('2024-05-20'),
        paidDate: null,
        description: 'Security services for April',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Invoices', null, {});
  }
}; 