const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        attributes: ['id', 'email', 'first_name', 'last_name', 'role', 'department', 'status']
      });
      Employee.hasMany(models.Payroll, {
        foreignKey: 'employeeId',
        as: 'payrolls'
      });
    }
  }
  
  Employee.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    shift: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attendance: {
      type: DataTypes.STRING,
      allowNull: true
    },
    performance: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'Employees',
    underscored: true,
    timestamps: true
  });

  return Employee;
}; 