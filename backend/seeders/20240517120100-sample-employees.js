"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Employees', [
      {
        userId: 1,
        position: 'Guard',
        department: 'Operations',
        shift: 'Day',
        attendance: 20,
        performance: 'Good',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        position: 'Supervisor',
        department: 'HR',
        shift: 'Night',
        attendance: 18,
        performance: 'Excellent',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        position: 'Guard',
        department: 'Finance',
        shift: 'Day',
        attendance: 22,
        performance: 'Good',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Employees', null, {});
  }
}; 