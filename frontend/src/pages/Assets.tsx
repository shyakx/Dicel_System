import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;
  assignedTo?: string;
}

const Assets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [form, setForm] = useState<Partial<Asset>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const { hasRole } = useAuth();
  const canEdit = hasRole(['admin', 'operations']);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/assets');
      setAssets(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load assets');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleEdit = (asset: Asset) => {
    setSelected(asset);
    setForm(asset);
    setEditOpen(true);
  };

  const handleDelete = (asset: Asset) => {
    setSelected(asset);
    setDeleteOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.put(`/api/assets/${selected.id}`, form);
      setEditOpen(false);
      fetchAssets();
    } catch (err) {
      alert('Failed to update asset');
    }
    setActionLoading(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/assets/${selected.id}`);
      setDeleteOpen(false);
      fetchAssets();
    } catch (err) {
      alert('Failed to delete asset');
    }
    setActionLoading(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', mt: 9 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary">
          Asset Management
        </Typography>
        {canEdit && (
          <Button variant="contained" color="primary" onClick={() => navigate('/assets/new')}>
            Add Asset
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, mx: 'auto', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>{asset.status}</TableCell>
                <TableCell>{asset.assignedTo || '-'}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small" onClick={() => navigate(`/assets/${asset.id}`)}>View</Button>{' '}
                  <Button variant="outlined" size="small" color="primary" onClick={() => handleEdit(asset)} sx={{ ml: 1 }}>Edit</Button>{' '}
                  <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(asset)} sx={{ ml: 1 }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Asset</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField label="Type" fullWidth margin="normal" value={form.type || ''} onChange={e => setForm({ ...form, type: e.target.value })} />
          <TextField label="Status" fullWidth margin="normal" value={form.status || ''} onChange={e => setForm({ ...form, status: e.target.value })} />
          <TextField label="Assigned To" fullWidth margin="normal" value={form.assignedTo || ''} onChange={e => setForm({ ...form, assignedTo: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} disabled={actionLoading} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Asset</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this asset?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} disabled={actionLoading} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assets; 