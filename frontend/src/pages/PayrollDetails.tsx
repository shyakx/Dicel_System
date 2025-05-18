import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface Payroll {
  id: number;
  employee: string;
  month: string;
  amount: string;
  status: string;
  // Add more fields as needed
}

const PayrollDetails = () => {
  const { id } = useParams();
  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/payroll/${id}`)
      .then(res => {
        setPayroll(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load payroll data');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!payroll) return null;

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">
        Payroll Details
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6">Employee: {payroll.employee}</Typography>
        <Typography>Month: {payroll.month}</Typography>
        <Typography>Amount: {payroll.amount}</Typography>
        <Typography>Status: {payroll.status}</Typography>
      </Paper>
    </Box>
  );
};

export default PayrollDetails; 