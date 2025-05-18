import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface Employee {
  id: number;
  name: string;
  position: string;
  status: string;
  email?: string;
  phone?: string;
  // Add more fields as needed
}

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/employees/${id}`)
      .then(res => {
        setEmployee(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load employee data');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!employee) return null;

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">
        Employee Profile
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6">{employee.name}</Typography>
        <Typography color="text.secondary">{employee.position}</Typography>
        <Typography>Status: {employee.status}</Typography>
        {employee.email && <Typography>Email: {employee.email}</Typography>}
        {employee.phone && <Typography>Phone: {employee.phone}</Typography>}
      </Paper>
    </Box>
  );
};

export default EmployeeProfile; 