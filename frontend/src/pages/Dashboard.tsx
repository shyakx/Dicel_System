import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Paper, Typography, CircularProgress, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import PaidIcon from '@mui/icons-material/Paid';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';

const COLORS = ['#2563eb', '#22c55e', '#f59e42', '#ef4444', '#a855f7', '#06b6d4'];

interface AnalyticsData {
  employees: {
    total: number;
    active: number;
    byDepartment: { department: string; count: number }[];
  };
  payroll: {
    thisMonth: number;
    lastMonth: number;
    yearToDate: number;
  };
  clients: {
    total: number;
    activeContracts: number;
    expiredContracts: number;
  };
  assets: {
    total: number;
    byStatus: { status: string; count: number }[];
  };
  invoices: {
    total: number;
    paid: number;
    unpaid: number;
    overdue: number;
  };
  recentActivity: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    updated_at: string;
  }[];
}

const Dashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/analytics/overview')
      .then(res => {
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load analytics');
        setLoading(false);
      });
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error || !analytics) return <Box sx={{ color: 'error.main', textAlign: 'center', mt: 6 }}>{error || 'No data'}</Box>;

  return (
    <div className="main-content" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Grid container spacing={3} justifyContent="center">
        {/* Employees Card */}
        <Grid item xs={12} md={4}>
          <Paper className="card" elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#2563eb', mr: 2 }} />
              <Typography variant="h6">Employees</Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>{analytics.employees.total}</Typography>
            <Typography color="text.secondary">Active: {analytics.employees.active}</Typography>
          </Paper>
        </Grid>
        {/* Payroll Card */}
        <Grid item xs={12} md={4}>
          <Paper className="card" elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaidIcon sx={{ fontSize: 40, color: '#22c55e', mr: 2 }} />
              <Typography variant="h6">Payroll</Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>${analytics.payroll.thisMonth}</Typography>
            <Typography color="text.secondary">Last Month: ${analytics.payroll.lastMonth}</Typography>
            <Typography color="text.secondary">YTD: ${analytics.payroll.yearToDate}</Typography>
          </Paper>
        </Grid>
        {/* Clients Card */}
        <Grid item xs={12} md={4}>
          <Paper className="card" elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon sx={{ fontSize: 40, color: '#f59e42', mr: 2 }} />
              <Typography variant="h6">Clients</Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>{analytics.clients.total}</Typography>
            <Typography color="text.secondary">Active: {analytics.clients.activeContracts}</Typography>
            <Typography color="text.secondary">Expired: {analytics.clients.expiredContracts}</Typography>
          </Paper>
        </Grid>
        {/* Assets Card */}
        <Grid item xs={12} md={4}>
          <Paper className="card" elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InventoryIcon sx={{ fontSize: 40, color: '#a855f7', mr: 2 }} />
              <Typography variant="h6">Assets</Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>{analytics.assets.total}</Typography>
            <Box sx={{ mt: 1 }}>
              {analytics.assets.byStatus.map((s, i) => (
                <Typography key={s.status} color="text.secondary">{s.status}: {s.count}</Typography>
              ))}
            </Box>
          </Paper>
        </Grid>
        {/* Invoices Card */}
        <Grid item xs={12} md={4}>
          <Paper className="card" elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ReceiptIcon sx={{ fontSize: 40, color: '#ef4444', mr: 2 }} />
              <Typography variant="h6">Invoices</Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>{analytics.invoices.total}</Typography>
            <Typography color="text.secondary">Paid: {analytics.invoices.paid}</Typography>
            <Typography color="text.secondary">Unpaid: {analytics.invoices.unpaid}</Typography>
            <Typography color="text.secondary">Overdue: {analytics.invoices.overdue}</Typography>
          </Paper>
        </Grid>
        {/* Employees by Department Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper className="card" elevation={3}>
            <Typography variant="h6" mb={2}>Employees by Department</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.employees.byDepartment}
                  dataKey="count"
                  nameKey="department"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#2563eb"
                  label
                >
                  {analytics.employees.byDepartment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        {/* Recent Activity Table */}
        <Grid item xs={12} md={6}>
          <Paper className="card" elevation={3}>
            <Typography variant="h6" mb={2}>Recent Activity</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.recentActivity.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.updated_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard; 