const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Employee, Asset, Client, Invoice, Payroll, Expense } = require('./models');
require('dotenv').config();
const authenticateJWT = require('./middleware/auth');
const { requireRole, requireDepartment } = require('./middleware/authorize');
const analyticsRoutes = require('./src/routes/analytics');
const payrollRoutes = require('./src/routes/payroll');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email }); // Log email only, not password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'email', 'password', 'first_name', 'last_name', 'role', 'department']
    });
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Invalid password for email:', email);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign({ 
      id: user.id, 
      role: user.role, 
      email: user.email, 
      department: user.department 
    }, JWT_SECRET, { expiresIn: '8h' });

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    console.error('Login error:', err); // Log full error
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Protect endpoints

// Admin dashboard stats endpoint
app.get('/api/admin/dashboard', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    const usersCount = await User.count();
    const employeesCount = await Employee.count();
    res.json({
      users: usersCount,
      employees: employeesCount,
      assets: 0,
      clients: 0,
      invoices: 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all employees with user info (HR Manager, Admin)
app.get('/api/employees', authenticateJWT, (req, res, next) => {
  if (
    (req.user.role && req.user.role.toLowerCase() === 'admin') ||
    (req.user.role && req.user.role.toLowerCase() === 'manager' && req.user.department && req.user.department.toLowerCase() === 'hr')
  ) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Insufficient role/department' });
}, async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'department', 'status'] }]
    });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get employee by ID
app.get('/api/employees/:id', authenticateJWT, async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all assets (Logistics Employee/Manager or Admin)
app.get('/api/assets', authenticateJWT, (req, res, next) => {
  if (
    (req.user.role && req.user.role.toLowerCase() === 'admin') ||
    (req.user.department && req.user.department.toLowerCase() === 'logistics')
  ) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Insufficient role/department' });
}, async (req, res) => {
  try {
    const assets = await Asset.findAll();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get asset by ID
app.get('/api/assets/:id', authenticateJWT, async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all clients (ClientRelations Employee/Manager or Admin)
app.get('/api/clients', authenticateJWT, (req, res, next) => {
  if (
    (req.user.role && req.user.role.toLowerCase() === 'admin') ||
    (req.user.department && req.user.department.toLowerCase() === 'clientrelations')
  ) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Insufficient role/department' });
}, async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get client by ID
app.get('/api/clients/:id', authenticateJWT, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create client
app.post('/api/clients', async (req, res) => {
  try {
    const { name, contact, email, contract, status } = req.body;
    const client = await Client.create({ name, contact, email, contract, status });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create client', error: err.message });
  }
});

// Update client
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { name, contact, email, contract, status } = req.body;
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    await client.update({ name, contact, email, contract, status });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update client', error: err.message });
  }
});

// Delete client (ClientRelations Manager only)
app.delete('/api/clients/:id', authenticateJWT, (req, res, next) => {
  if (
    req.user.role && req.user.role.toLowerCase() === 'manager' &&
    req.user.department && req.user.department.toLowerCase() === 'clientrelations'
  ) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Insufficient role/department' });
}, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    await client.destroy();
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete client', error: err.message });
  }
});

// Get all invoices (Finance Employee/Manager or Admin)
app.get('/api/invoices', authenticateJWT, async (req, res) => {
  try {
    // Check if user has required role/department
    if (!req.user || (!req.user.role && !req.user.department)) {
      return res.status(403).json({ message: 'Forbidden: User role or department not found' });
    }

    const userRole = req.user.role?.toLowerCase();
    const userDepartment = req.user.department?.toLowerCase();

    if (userRole !== 'admin' && userDepartment !== 'finance') {
      return res.status(403).json({ message: 'Forbidden: Insufficient role/department' });
    }

    const invoices = await Invoice.findAll({
      include: [{ 
        model: Client, 
        as: 'client', 
        attributes: ['id', 'name', 'email'] 
      }]
    });
    res.json(invoices);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get invoice by ID
app.get('/api/invoices/:id', authenticateJWT, async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create invoice
app.post('/api/invoices', authenticateJWT, async (req, res) => {
  try {
    // Check if user has required role/department
    if (!req.user || (!req.user.role && !req.user.department)) {
      return res.status(403).json({ message: 'Forbidden: User role or department not found' });
    }

    const userRole = req.user.role?.toLowerCase();
    const userDepartment = req.user.department?.toLowerCase();

    if (userRole !== 'admin' && userDepartment !== 'finance') {
      return res.status(403).json({ message: 'Forbidden: Insufficient role/department' });
    }

    const { clientId, amount, status, dueDate, paidDate, description } = req.body;
    
    // Validate required fields
    if (!clientId || !amount || !status || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const invoice = await Invoice.create({ 
      clientId, 
      amount, 
      status, 
      dueDate, 
      paidDate, 
      description 
    });
    res.status(201).json(invoice);
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ message: 'Failed to create invoice', error: err.message });
  }
});

// Update invoice
app.put('/api/invoices/:id', authenticateJWT, async (req, res) => {
  try {
    // Check if user has required role/department
    if (!req.user || (!req.user.role && !req.user.department)) {
      return res.status(403).json({ message: 'Forbidden: User role or department not found' });
    }

    const userRole = req.user.role?.toLowerCase();
    const userDepartment = req.user.department?.toLowerCase();

    if (userRole !== 'admin' && userDepartment !== 'finance') {
      return res.status(403).json({ message: 'Forbidden: Insufficient role/department' });
    }

    const { clientId, amount, status, dueDate, paidDate, description } = req.body;
    
    // Validate required fields
    if (!clientId || !amount || !status || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await invoice.update({ 
      clientId, 
      amount, 
      status, 
      dueDate, 
      paidDate, 
      description 
    });
    res.json(invoice);
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({ message: 'Failed to update invoice', error: err.message });
  }
});

// Delete invoice
app.delete('/api/invoices/:id', authenticateJWT, async (req, res) => {
  try {
    // Check if user has required role/department
    if (!req.user || (!req.user.role && !req.user.department)) {
      return res.status(403).json({ message: 'Forbidden: User role or department not found' });
    }

    const userRole = req.user.role?.toLowerCase();
    const userDepartment = req.user.department?.toLowerCase();

    if (userRole !== 'admin' && userDepartment !== 'finance') {
      return res.status(403).json({ message: 'Forbidden: Insufficient role/department' });
    }

    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await invoice.destroy();
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(500).json({ message: 'Failed to delete invoice', error: err.message });
  }
});

// Reports summary endpoint (Executive Boss, Admin, Managers)
app.get('/api/reports/summary', authenticateJWT, (req, res, next) => {
  if (
    (req.user.role && req.user.role.toLowerCase() === 'admin') ||
    (req.user.role && req.user.role.toLowerCase() === 'boss') ||
    (req.user.role && req.user.role.toLowerCase() === 'manager')
  ) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Insufficient role' });
}, async (req, res) => {
  try {
    const employees = await Employee.count();
    const assets = await Asset.count();
    const clients = await Client.count();
    const invoices = await Invoice.count();
    res.json({ employees, assets, clients, invoices });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, password, position, department, shift, status } = req.body;
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: 'employee', status });
    const employee = await Employee.create({ userId: user.id, position, department, shift, attendance: 0, performance: 'Good' });
    res.status(201).json({ ...employee.toJSON(), user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create employee', error: err.message });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { position, department, shift, attendance, performance, status } = req.body;
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await employee.update({ position, department, shift, attendance, performance });
    // Update user status if provided
    if (status) {
      const user = await User.findByPk(employee.userId);
      if (user) await user.update({ status });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update employee', error: err.message });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await User.destroy({ where: { id: employee.userId } });
    await employee.destroy();
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete employee', error: err.message });
  }
});

// Create asset
app.post('/api/assets', async (req, res) => {
  try {
    const { name, type, status, assignedTo } = req.body;
    const asset = await Asset.create({ name, type, status, assignedTo });
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create asset', error: err.message });
  }
});

// Update asset
app.put('/api/assets/:id', async (req, res) => {
  try {
    const { name, type, status, assignedTo } = req.body;
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    await asset.update({ name, type, status, assignedTo });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update asset', error: err.message });
  }
});

// Delete asset
app.delete('/api/assets/:id', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    await asset.destroy();
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete asset', error: err.message });
  }
});

// Get all payroll records with employee info
app.get('/api/payroll', async (req, res) => {
  try {
    const payrolls = await Payroll.findAll({
      include: [{ 
        model: Employee, 
        as: 'employee',
        include: [{ 
          model: User, 
          as: 'user', 
          attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'department', 'status'] 
        }]
      }]
    });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get payroll by ID with employee and user info
app.get('/api/payroll/:id', async (req, res) => {
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
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payroll details', error: err.message });
  }
});

// Create payroll record
app.post('/api/payroll', async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      status,
      paymentDate,
      paymentMethod,
      bankAccount,
      remarks
    } = req.body;

    const payroll = await Payroll.create({
      employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      status,
      paymentDate,
      paymentMethod,
      bankAccount,
      remarks
    });
    res.status(201).json(payroll);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payroll record', error: err.message });
  }
});

// Update payroll record
app.put('/api/payroll/:id', async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      status,
      paymentDate,
      paymentMethod,
      bankAccount,
      remarks
    } = req.body;

    const payroll = await Payroll.findByPk(req.params.id);
    if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });

    await payroll.update({
      employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      status,
      paymentDate,
      paymentMethod,
      bankAccount,
      remarks
    });
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update payroll record', error: err.message });
  }
});

// Delete payroll record
app.delete('/api/payroll/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });
    await payroll.destroy();
    res.json({ message: 'Payroll record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete payroll record', error: err.message });
  }
});

// System settings (Executive Boss, Admin)
app.get('/api/settings', authenticateJWT, (req, res, next) => {
  if (
    (req.user.role && req.user.role.toLowerCase() === 'admin') ||
    (req.user.role && req.user.role.toLowerCase() === 'boss')
  ) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Insufficient role' });
}, async (req, res) => {
  // ... existing code ...
});
app.post('/api/settings', authenticateJWT, (req, res, next) => {
  if (
    (req.user.role && req.user.role.toLowerCase() === 'admin') ||
    (req.user.role && req.user.role.toLowerCase() === 'boss')
  ) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Insufficient role' });
}, async (req, res) => {
  // ... existing code ...
});

// IT endpoints (IT Employee/Manager)
app.get('/api/logs', authenticateJWT, requireDepartment('IT'), async (req, res) => {
  // ... existing code ...
});
app.get('/api/access/my', authenticateJWT, requireDepartment('IT'), async (req, res) => {
  // ... existing code ...
});
app.post('/api/issues', authenticateJWT, requireDepartment('IT'), async (req, res) => {
  // ... existing code ...
});

// Get logged-in user's expenses (Finance Employee/Manager)
app.get('/api/expenses/my', authenticateJWT, requireDepartment('Finance'), async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
});

// Submit new expense (Finance Employee/Manager)
app.post('/api/expenses', authenticateJWT, requireDepartment('Finance'), async (req, res) => {
  try {
    const { title, amount, date, description } = req.body;
    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      date,
      description
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit expense', error: err.message });
  }
});

// Get logged-in user's salary info and pay history (Finance Employee/Manager)
app.get('/api/salary/my', authenticateJWT, requireDepartment('Finance'), async (req, res) => {
  try {
    // Find the employee record for the logged-in user
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) return res.status(404).json({ message: 'Employee record not found' });
    // Get all payroll records for this employee
    const payrolls = await Payroll.findAll({
      where: { employeeId: employee.id },
      order: [['year', 'DESC'], ['month', 'DESC']]
    });
    // Current salary is the most recent payroll record
    const salary = payrolls[0] || null;
    res.json({
      salary,
      history: payrolls
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch salary info', error: err.message });
  }
});

app.use('/api/analytics', analyticsRoutes);
app.use('/api/payroll', payrollRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});