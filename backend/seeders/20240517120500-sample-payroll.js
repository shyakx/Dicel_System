"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Payrolls', [
      {
        employeeId: 1,
        month: 4,
        year: 2024,
        basicSalary: 1000,
        allowances: 200,
        deductions: 0,
        netSalary: 1200,
        status: 'Paid',
        paymentDate: new Date('2024-05-01'),
        paymentMethod: 'Bank Transfer',
        bankAccount: '123456789',
        remarks: 'April salary',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        employeeId: 2,
        month: 4,
        year: 2024,
        basicSalary: 1200,
        allowances: 300,
        deductions: 0,
        netSalary: 1500,
        status: 'Pending',
        paymentDate: null,
        paymentMethod: 'Bank Transfer',
        bankAccount: '987654321',
        remarks: 'April salary',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Payrolls', null, {});
  }
}; 