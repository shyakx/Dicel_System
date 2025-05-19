import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Client {
  id: number;
  name: string;
  contact: string;
  email: string;
  contract: string;
  status: string;
}

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);
  const [form, setForm] = useState<Partial<Client>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const { hasRole } = useAuth();
  const canEdit = hasRole(['admin', 'operations']);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/clients');
      setClients(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load clients');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEdit = (client: Client) => {
    setSelected(client);
    setForm(client);
    setEditOpen(true);
  };

  const handleDelete = (client: Client) => {
    setSelected(client);
    setDeleteOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.put(`/api/clients/${selected.id}`, form);
      setEditOpen(false);
      fetchClients();
    } catch (err) {
      alert('Failed to update client');
    }
    setActionLoading(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/clients/${selected.id}`);
      setDeleteOpen(false);
      fetchClients();
    } catch (err) {
      alert('Failed to delete client');
    }
    setActionLoading(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', mt: 9 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary">
          Client Management
        </Typography>
        {canEdit && (
          <Button variant="contained" color="primary" onClick={() => navigate('/clients/new')}>
            Add Client
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, mx: 'auto', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contract</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.contact}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.contract}</TableCell>
                <TableCell>{client.status}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small" onClick={() => navigate(`/clients/${client.id}`)}>View</Button>
                  {canEdit && (
                    <>
                      {' '}
                      <Button variant="outlined" size="small" color="primary" onClick={() => handleEdit(client)} sx={{ ml: 1 }}>Edit</Button>
                      {' '}
                      <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(client)} sx={{ ml: 1 }}>Delete</Button>
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
        <DialogTitle>Edit Client</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField label="Contact" fullWidth margin="normal" value={form.contact || ''} onChange={e => setForm({ ...form, contact: e.target.value })} />
          <TextField label="Email" fullWidth margin="normal" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField label="Contract" fullWidth margin="normal" value={form.contract || ''} onChange={e => setForm({ ...form, contract: e.target.value })} />
          <TextField label="Status" fullWidth margin="normal" value={form.status || ''} onChange={e => setForm({ ...form, status: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} disabled={actionLoading} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this client?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} disabled={actionLoading} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clients; 