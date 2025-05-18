'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'Executive' to the department ENUM
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Users_department" ADD VALUE IF NOT EXISTS 'Executive';`);
  },
  down: async (queryInterface, Sequelize) => {
    // No down migration (removing ENUM values is not supported in Postgres)
  }
}; 