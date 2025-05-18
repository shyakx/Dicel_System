"use strict";
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Delete all relevant users before inserting
    await queryInterface.bulkDelete('Users', {
      email: { [Op.in]: [
        'john@example.com',
        'jane@example.com',
        'alice@example.com',
        'boss@dicel.com',
        'aline.uwase@dicel.rw',
        'jean.niyonzima@dicel.rw',
        'chantal.mukamana@dicel.rw',
        'ops.employee@dicel.com',
        'ops.manager@dicel.com',
        'hr.employee@dicel.com',
        'hr.manager@dicel.com',
        'fin.employee@dicel.com',
        'fin.manager@dicel.com',
        'log.employee@dicel.com',
        'log.manager@dicel.com',
        'cr.employee@dicel.com',
        'cr.manager@dicel.com',
        'it.employee@dicel.com',
        'it.manager@dicel.com'
      ]}
    }, {});

    await queryInterface.bulkInsert('Users', [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        status: 'Active',
        department: 'Operations',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        status: 'On Leave',
        department: 'HR',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Alice',
        last_name: 'Brown',
        email: 'alice@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Employee',
        status: 'Active',
        department: 'Finance',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Executive',
        last_name: 'Boss',
        email: 'boss@dicel.com',
        password: await bcrypt.hash('Boss@123', 10),
        role: 'Admin',
        status: 'active',
        department: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
}; 