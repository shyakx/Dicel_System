'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payroll extends Model {
    static associate(models) {
      Payroll.belongsTo(models.Employee, { as: 'employee', foreignKey: 'employeeId' });
    }
  }
  Payroll.init({
    employeeId: { type: DataTypes.INTEGER, field: 'employeeId' },
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    basicSalary: { type: DataTypes.INTEGER, field: 'basicSalary' },
    allowances: DataTypes.INTEGER,
    deductions: DataTypes.INTEGER,
    netSalary: { type: DataTypes.INTEGER, field: 'netSalary' },
    status: DataTypes.STRING,
    paymentDate: { type: DataTypes.DATE, field: 'paymentDate' },
    paymentMethod: { type: DataTypes.STRING, field: 'paymentMethod' },
    bankAccount: { type: DataTypes.STRING, field: 'bankAccount' },
    remarks: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payroll',
    tableName: 'Payrolls',
    timestamps: true
  });
  return Payroll;
};