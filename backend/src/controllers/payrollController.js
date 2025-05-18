const { Payroll, Employee, User } = require('../../models');

// Get all payrolls with employee and user info
exports.getAllPayrolls = async (req, res) => {
  try {
    console.log('Fetching all payrolls...');
    const payrolls = await Payroll.findAll({
      include: [{
        model: Employee,
        as: 'employee',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'first_name', 'last_name', 'role', 'department', 'status']
        }]
      }]
    });
    console.log('Payrolls fetched:', payrolls.length, payrolls);
    res.json(payrolls);
  } catch (error) {
    console.error('Payroll error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get payroll by ID with employee and user info
exports.getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findOne({
      where: { id: req.params.id },
      include: [{
        model: Employee,
        as: 'employee',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'first_name', 'last_name', 'role', 'department', 'status']
        }]
      }]
    });
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    res.json(payroll);
  } catch (error) {
    console.error('Payroll error:', error);
    res.status(500).json({ message: error.message });
  }
};