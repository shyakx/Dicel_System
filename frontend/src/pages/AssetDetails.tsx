import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;
  assignedTo?: string;
  // Add more fields as needed
}

const AssetDetails = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/assets/${id}`)
      .then(res => {
        setAsset(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load asset data');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!asset) return null;

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">
        Asset Details
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6">{asset.name}</Typography>
        <Typography color="text.secondary">{asset.type}</Typography>
        <Typography>Status: {asset.status}</Typography>
        {asset.assignedTo && <Typography>Assigned To: {asset.assignedTo}</Typography>}
      </Paper>
    </Box>
  );
};

export default AssetDetails; 