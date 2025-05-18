import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface Invoice {
  id: number;
  client: string;
  amount: string;
  due: string;
  status: string;
  // Add more fields as needed
}

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/invoices/${id}`)
      .then(res => {
        setInvoice(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load invoice data');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!invoice) return null;

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">
        Invoice Details
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6">Client: {invoice.client}</Typography>
        <Typography>Amount: {invoice.amount}</Typography>
        <Typography>Due Date: {invoice.due}</Typography>
        <Typography>Status: {invoice.status}</Typography>
      </Paper>
    </Box>
  );
};

export default InvoiceDetails; 