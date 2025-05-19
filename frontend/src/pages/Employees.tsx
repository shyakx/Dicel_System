import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Employee {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  status: string;
}

const Employees = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [form, setForm] = useState<Partial<Employee>>({});
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/employees');
      setEmployees(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load employees');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee: Employee) => {
    setSelected(employee);
    setForm(employee);
    setEditOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelected(employee);
    setDeleteOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.put(`/api/employees/${selected.id}`, form);
      setEditOpen(false);
      fetchEmployees();
    } catch (err) {
      alert('Failed to update employee');
    }
    setActionLoading(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/employees/${selected.id}`);
      setDeleteOpen(false);
      fetchEmployees();
    } catch (err) {
      alert('Failed to delete employee');
    }
    setActionLoading(false);
  };

  const canEdit = hasRole(['admin', 'hr']);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', mt: 9 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary">
          Employee Management
        </Typography>
        {canEdit && (
          <Button variant="contained" color="primary" onClick={() => navigate('/employees/new')}>
            Add Employee
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, mx: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Hire Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
                <TableCell>{employee.status}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small" onClick={() => navigate(`/employees/${employee.id}`)}>View</Button>
                  {canEdit && (
                    <>
                      {' '}
                      <Button variant="outlined" size="small" color="primary" onClick={() => handleEdit(employee)} sx={{ ml: 1 }}>Edit</Button>
                      {' '}
                      <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(employee)} sx={{ ml: 1 }}>Delete</Button>
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
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <TextField label="First Name" fullWidth margin="normal" value={form.firstName || ''} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          <TextField label="Last Name" fullWidth margin="normal" value={form.lastName || ''} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          <TextField label="Email" fullWidth margin="normal" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField label="Phone" fullWidth margin="normal" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <TextField label="Position" fullWidth margin="normal" value={form.position || ''} onChange={e => setForm({ ...form, position: e.target.value })} />
          <TextField label="Department" fullWidth margin="normal" value={form.department || ''} onChange={e => setForm({ ...form, department: e.target.value })} />
          <TextField label="Hire Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={form.hireDate ? form.hireDate.slice(0, 10) : ''} onChange={e => setForm({ ...form, hireDate: e.target.value })} />
          <TextField label="Status" fullWidth margin="normal" value={form.status || ''} onChange={e => setForm({ ...form, status: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} disabled={actionLoading} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} disabled={actionLoading} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees; 