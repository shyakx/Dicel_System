import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Payroll {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
  paymentDate?: string;
  paymentMethod?: string;
  bankAccount?: string;
  remarks?: string;
}

const Payroll = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Payroll | null>(null);
  const [form, setForm] = useState<Partial<Payroll>>({});
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/payroll');
      setPayrolls(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load payroll records');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleEdit = (payroll: Payroll) => {
    setSelected(payroll);
    setForm(payroll);
    setEditOpen(true);
  };

  const handleDelete = (payroll: Payroll) => {
    setSelected(payroll);
    setDeleteOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.put(`/api/payroll/${selected.id}`, form);
      setEditOpen(false);
      fetchPayrolls();
    } catch (err) {
      alert('Failed to update payroll record');
    }
    setActionLoading(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/payroll/${selected.id}`);
      setDeleteOpen(false);
      fetchPayrolls();
    } catch (err) {
      alert('Failed to delete payroll record');
    }
    setActionLoading(false);
  };

  const canEdit = hasRole(['admin', 'finance']);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary">
          Payroll Management
        </Typography>
        {canEdit && (
          <Button variant="contained" color="primary" onClick={() => navigate('/payroll/new')}>
            Add Payroll Record
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Basic Salary</TableCell>
              <TableCell>Allowances</TableCell>
              <TableCell>Deductions</TableCell>
              <TableCell>Net Salary</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell>{payroll.employeeId}</TableCell>
                <TableCell>{payroll.month}</TableCell>
                <TableCell>{payroll.year}</TableCell>
                <TableCell>{payroll.basicSalary}</TableCell>
                <TableCell>{payroll.allowances}</TableCell>
                <TableCell>{payroll.deductions}</TableCell>
                <TableCell>{payroll.netSalary}</TableCell>
                <TableCell>{payroll.status}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small" onClick={() => navigate(`/payroll/${payroll.id}`)}>View</Button>
                  {canEdit && (
                    <>
                      {' '}
                      <Button variant="outlined" size="small" color="primary" onClick={() => handleEdit(payroll)} sx={{ ml: 1 }}>Edit</Button>
                      {' '}
                      <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(payroll)} sx={{ ml: 1 }}>Delete</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Payroll</DialogTitle>
        <DialogContent>
          <TextField label="Employee ID" type="number" fullWidth margin="normal" value={form.employeeId || ''} onChange={e => setForm({ ...form, employeeId: Number(e.target.value) })} />
          <TextField label="Month" type="number" fullWidth margin="normal" value={form.month || ''} onChange={e => setForm({ ...form, month: Number(e.target.value) })} />
          <TextField label="Year" type="number" fullWidth margin="normal" value={form.year || ''} onChange={e => setForm({ ...form, year: Number(e.target.value) })} />
          <TextField label="Basic Salary" type="number" fullWidth margin="normal" value={form.basicSalary || ''} onChange={e => setForm({ ...form, basicSalary: Number(e.target.value) })} />
          <TextField label="Allowances" type="number" fullWidth margin="normal" value={form.allowances || ''} onChange={e => setForm({ ...form, allowances: Number(e.target.value) })} />
          <TextField label="Deductions" type="number" fullWidth margin="normal" value={form.deductions || ''} onChange={e => setForm({ ...form, deductions: Number(e.target.value) })} />
          <TextField label="Net Salary" type="number" fullWidth margin="normal" value={form.netSalary || ''} onChange={e => setForm({ ...form, netSalary: Number(e.target.value) })} />
          <TextField label="Status" fullWidth margin="normal" value={form.status || ''} onChange={e => setForm({ ...form, status: e.target.value })} />
          <TextField label="Payment Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={form.paymentDate ? form.paymentDate.slice(0, 10) : ''} onChange={e => setForm({ ...form, paymentDate: e.target.value })} />
          <TextField label="Payment Method" fullWidth margin="normal" value={form.paymentMethod || ''} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} />
          <TextField label="Bank Account" fullWidth margin="normal" value={form.bankAccount || ''} onChange={e => setForm({ ...form, bankAccount: e.target.value })} />
          <TextField label="Remarks" fullWidth margin="normal" value={form.remarks || ''} onChange={e => setForm({ ...form, remarks: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} disabled={actionLoading} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Payroll</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this payroll record?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} disabled={actionLoading} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payroll; 