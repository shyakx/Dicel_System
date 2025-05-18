import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface Client {
  id: number;
  name: string;
  contract: string;
  status: string;
  contactEmail?: string;
  // Add more fields as needed
}

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/clients/${id}`)
      .then(res => {
        setClient(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load client data');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!client) return null;

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">
        Client Details
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6">{client.name}</Typography>
        <Typography color="text.secondary">Contract: {client.contract}</Typography>
        <Typography>Status: {client.status}</Typography>
        {client.contactEmail && <Typography>Email: {client.contactEmail}</Typography>}
      </Paper>
    </Box>
  );
};

export default ClientDetails; 