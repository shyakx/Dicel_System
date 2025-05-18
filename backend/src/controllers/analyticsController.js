const { User, Employee, Payroll, Client, Asset, Invoice } = require('../../models');
const { Op } = require('sequelize');

exports.getOverview = async (req, res) => {
  try {
    // Employees
    const totalEmployees = await Employee.count();
    const activeEmployees = await User.count({ where: { status: 'Active' } });
    const employeesByDepartment = await User.findAll({
      attributes: ['department', [User.sequelize.fn('COUNT', User.sequelize.col('department')), 'count']],
      group: ['department']
    });

    // Payroll
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
    const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;
    const totalPayrollThisMonth = await Payroll.sum('netSalary', { where: { month: thisMonth, year: thisYear } });
    const totalPayrollLastMonth = await Payroll.sum('netSalary', { where: { month: lastMonth, year: lastMonthYear } });
    const totalPayrollYTD = await Payroll.sum('netSalary', { where: { year: thisYear } });

    // Clients
    const totalClients = await Client.count();
    const activeContracts = await Client.count({ where: { status: 'Active' } });
    const expiredContracts = await Client.count({ where: { status: 'Expired' } });

    // Assets
    const totalAssets = await Asset.count();
    const assetsByStatus = await Asset.findAll({
      attributes: ['status', [Asset.sequelize.fn('COUNT', Asset.sequelize.col('status')), 'count']],
      group: ['status']
    });

    // Invoices
    const totalInvoices = await Invoice.count();
    const paidInvoices = await Invoice.count({ where: { status: 'Paid' } });
    const unpaidInvoices = await Invoice.count({ where: { status: 'Unpaid' } });
    const overdueInvoices = await Invoice.count({
      where: {
        status: 'Unpaid',
        dueDate: { [Op.lt]: new Date() }
      }
    });

    // Recent Activity (last 5 users updated)
    const recentActivity = await User.findAll({
      order: [['updated_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'first_name', 'last_name', 'email', 'updated_at']
    });

    res.json({
      employees: {
        total: totalEmployees,
        active: activeEmployees,
        byDepartment: employeesByDepartment
      },
      payroll: {
        thisMonth: totalPayrollThisMonth || 0,
        lastMonth: totalPayrollLastMonth || 0,
        yearToDate: totalPayrollYTD || 0
      },
      clients: {
        total: totalClients,
        activeContracts,
        expiredContracts
      },
      assets: {
        total: totalAssets,
        byStatus: assetsByStatus
      },
      invoices: {
        total: totalInvoices,
        paid: paidInvoices,
        unpaid: unpaidInvoices,
        overdue: overdueInvoices
      },
      recentActivity
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: err.message });
  }
}; 