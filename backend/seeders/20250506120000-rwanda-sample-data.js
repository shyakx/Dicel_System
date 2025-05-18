'use strict';
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Define all user emails to be inserted
      const rwandanUsers = [
        {
          first_name: 'Uwase',
          last_name: 'Aline',
          email: 'aline.uwase@dicel.rw',
          password: await bcrypt.hash('Aline@2024', 10),
          role: 'Employee',
          department: 'Operations',
          status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          first_name: 'Niyonzima',
          last_name: 'Jean',
          email: 'jean.niyonzima@dicel.rw',
          password: await bcrypt.hash('Jean@2024', 10),
          role: 'Employee',
          department: 'Logistics',
          status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          first_name: 'Mukamana',
          last_name: 'Chantal',
          email: 'chantal.mukamana@dicel.rw',
          password: await bcrypt.hash('Chantal@2024', 10),
          role: 'Employee',
          department: 'Operations',
          status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      const testUsers = [
        // Operations
        { first_name: 'Ops', last_name: 'Employee', email: 'ops.employee@dicel.com', password: await bcrypt.hash('OpsEmp@123', 10), role: 'Employee', status: 'active', department: 'Operations', position: 'Guard', shift: 'Day' },
        { first_name: 'Ops', last_name: 'Manager', email: 'ops.manager@dicel.com', password: await bcrypt.hash('OpsMgr@123', 10), role: 'Manager', status: 'active', department: 'Operations', position: 'Manager', shift: 'Day' },
        // HR
        { first_name: 'HR', last_name: 'Employee', email: 'hr.employee@dicel.com', password: await bcrypt.hash('HREmp@123', 10), role: 'Employee', status: 'active', department: 'HR', position: 'HR Assistant', shift: 'Day' },
        { first_name: 'HR', last_name: 'Manager', email: 'hr.manager@dicel.com', password: await bcrypt.hash('HRMgr@123', 10), role: 'Manager', status: 'active', department: 'HR', position: 'HR Manager', shift: 'Day' },
        // Finance
        { first_name: 'Finance', last_name: 'Employee', email: 'fin.employee@dicel.com', password: await bcrypt.hash('FinEmp@123', 10), role: 'Employee', status: 'active', department: 'Finance', position: 'Accountant', shift: 'Day' },
        { first_name: 'Finance', last_name: 'Manager', email: 'fin.manager@dicel.com', password: await bcrypt.hash('FinMgr@123', 10), role: 'Manager', status: 'active', department: 'Finance', position: 'Finance Manager', shift: 'Day' },
        // Logistics
        { first_name: 'Logistics', last_name: 'Employee', email: 'log.employee@dicel.com', password: await bcrypt.hash('LogEmp@123', 10), role: 'Employee', status: 'active', department: 'Logistics', position: 'Driver', shift: 'Day' },
        { first_name: 'Logistics', last_name: 'Manager', email: 'log.manager@dicel.com', password: await bcrypt.hash('LogMgr@123', 10), role: 'Manager', status: 'active', department: 'Logistics', position: 'Logistics Manager', shift: 'Day' },
        // Client Relations
        { first_name: 'ClientRel', last_name: 'Employee', email: 'cr.employee@dicel.com', password: await bcrypt.hash('CREmp@123', 10), role: 'Employee', status: 'active', department: 'ClientRelations', position: 'Client Rep', shift: 'Day' },
        { first_name: 'ClientRel', last_name: 'Manager', email: 'cr.manager@dicel.com', password: await bcrypt.hash('CRMgr@123', 10), role: 'Manager', status: 'active', department: 'ClientRelations', position: 'Client Manager', shift: 'Day' },
        // IT
        { first_name: 'IT', last_name: 'Employee', email: 'it.employee@dicel.com', password: await bcrypt.hash('ITEmp@123', 10), role: 'Employee', status: 'active', department: 'IT', position: 'IT Support', shift: 'Day' },
        { first_name: 'IT', last_name: 'Manager', email: 'it.manager@dicel.com', password: await bcrypt.hash('ITMgr@123', 10), role: 'Manager', status: 'active', department: 'IT', position: 'IT Manager', shift: 'Day' },
        // Executive
        { first_name: 'Executive', last_name: 'Boss', email: 'boss@dicel.com', password: await bcrypt.hash('Boss@123', 10), role: 'Admin', status: 'active', department: 'Executive', position: 'Executive', shift: 'Day' },
      ];

      const allEmails = [
        ...rwandanUsers.map(u => u.email),
        ...testUsers.map(u => u.email),
        'john@example.com',
        'jane@example.com',
        'alice@example.com'
      ];

      // Delete all relevant payrolls and users before inserting
      await queryInterface.bulkDelete('Payrolls', null, { transaction });
      await queryInterface.bulkDelete('Employees', null, { transaction });
      await queryInterface.bulkDelete('Users', { email: { [Op.in]: allEmails } }, { transaction });

      // Insert Rwandan users
      await queryInterface.bulkInsert('Users', rwandanUsers, { transaction });

      // Get inserted user IDs for Rwandan users
      const rwandanEmails = rwandanUsers.map(u => u.email);
      const insertedUsers = await queryInterface.sequelize.query(
        `SELECT id, email FROM "Users" WHERE email IN (${rwandanEmails.map(e => `'${e}'`).join(', ')})`,
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );

      // Add employees for Rwandan users
      const employees = insertedUsers.map((user, idx) => ({
        userId: user.id,
        position: ['Security Guard', 'Driver', 'Supervisor'][idx] || 'Staff',
        department: ['Operations', 'Logistics', 'Operations'][idx] || 'Operations',
        shift: ['Day', 'Night', 'Day'][idx] || 'Day',
        attendance: 0,
        performance: 'Good',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await queryInterface.bulkInsert('Employees', employees, { transaction });

      // Insert test users
      const usersToInsert = testUsers.map(u => ({
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        password: u.password,
        role: u.role,
        department: u.department,
        status: u.status,
        created_at: new Date(),
        updated_at: new Date()
      }));
      await queryInterface.bulkInsert('Users', usersToInsert, { transaction });

      // Get inserted test user IDs
      const testUserEmailsArr = testUsers.map(u => u.email);
      const insertedTestUsers = await queryInterface.sequelize.query(
        `SELECT id, email FROM "Users" WHERE email IN (${testUserEmailsArr.map(e => `'${e}'`).join(', ')})`,
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );
      // Map email to userId
      const emailToId = Object.fromEntries(insertedTestUsers.map(u => [u.email, u.id]));

      // Prepare Employee records for employees and managers
      const testEmployees = testUsers
        .filter(u => u.role === 'Employee' || u.role === 'Manager')
        .map(u => ({
          userId: emailToId[u.email],
          position: u.position || 'Staff',
          department: u.department || 'General',
          shift: u.shift || 'Day',
          attendance: 0,
          performance: 'Good',
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      if (testEmployees.length > 0) {
        await queryInterface.bulkInsert('Employees', testEmployees, { transaction });
      }
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    const { Op } = require('sequelize');
    const emails = [
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
      'it.manager@dicel.com',
      'boss@dicel.com'
    ];
    await queryInterface.bulkDelete('Payrolls', null, {});
    await queryInterface.bulkDelete('Employees', null, {});
    await queryInterface.bulkDelete('Users', { email: { [Op.in]: emails } }, {});
  }
}; 