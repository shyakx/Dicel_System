'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    }
  }
  Expense.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    date: DataTypes.DATEONLY,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Expense',
  });
  return Expense;
}; 