import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Invoice {
  id: number;
  clientId: number;
  amount: number;
  status: string;
  dueDate: string;
  paidDate?: string;
  description?: string;
}

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [form, setForm] = useState<Partial<Invoice>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const { hasRole } = useAuth();
  const canEdit = hasRole(['admin', 'finance']);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/invoices');
      setInvoices(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load invoices');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleEdit = (invoice: Invoice) => {
    setSelected(invoice);
    setForm(invoice);
    setEditOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {
    setSelected(invoice);
    setDeleteOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.put(`/api/invoices/${selected.id}`, form);
      setEditOpen(false);
      fetchInvoices();
    } catch (err) {
      alert('Failed to update invoice');
    }
    setActionLoading(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/invoices/${selected.id}`);
      setDeleteOpen(false);
      fetchInvoices();
    } catch (err) {
      alert('Failed to delete invoice');
    }
    setActionLoading(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary">
          Invoice Management
        </Typography>
        {canEdit && (
          <Button variant="contained" color="primary" onClick={() => navigate('/invoices/new')}>
            Add Invoice
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Paid Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.clientId}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{invoice.description || '-'}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small" onClick={() => navigate(`/invoices/${invoice.id}`)}>View</Button>
                  {canEdit && (
                    <>
                      {' '}
                      <Button variant="outlined" size="small" color="primary" onClick={() => handleEdit(invoice)} sx={{ ml: 1 }}>Edit</Button>
                      {' '}
                      <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(invoice)} sx={{ ml: 1 }}>Delete</Button>
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
        <DialogTitle>Edit Invoice</DialogTitle>
        <DialogContent>
          <TextField label="Client ID" type="number" fullWidth margin="normal" value={form.clientId || ''} onChange={e => setForm({ ...form, clientId: Number(e.target.value) })} />
          <TextField label="Amount" type="number" fullWidth margin="normal" value={form.amount || ''} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} />
          <TextField label="Status" fullWidth margin="normal" value={form.status || ''} onChange={e => setForm({ ...form, status: e.target.value })} />
          <TextField label="Due Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={form.dueDate ? form.dueDate.slice(0, 10) : ''} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          <TextField label="Paid Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={form.paidDate ? form.paidDate.slice(0, 10) : ''} onChange={e => setForm({ ...form, paidDate: e.target.value })} />
          <TextField label="Description" fullWidth margin="normal" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} disabled={actionLoading} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Invoice</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this invoice?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} disabled={actionLoading} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices; 