'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    }
  }
  Employee.init({
    userId: DataTypes.INTEGER,
    position: DataTypes.STRING,
    department: DataTypes.STRING,
    shift: DataTypes.STRING,
    attendance: DataTypes.INTEGER,
    performance: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};