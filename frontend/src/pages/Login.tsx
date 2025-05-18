import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../axiosConfig';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', form);
      const userWithToken = { ...response.data.user, token: response.data.token };
      login(userWithToken);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      bgcolor: 'rgba(245,247,250,0.85)',
      position: 'relative',
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <img src="/logo.png" alt="Dicel Security Company Logo" style={{ height: 90, marginBottom: 18, background: 'rgba(255,255,255,0.85)', borderRadius: 12, padding: 8 }} />
        <Paper elevation={3} sx={{ p: 5, borderRadius: 4, minWidth: 350, maxWidth: 400, mx: 2, boxShadow: '0 4px 24px 0 rgba(60,60,60,0.08)', background: 'rgba(255,255,255,0.95)' }}>
          <Typography variant="h4" fontWeight={700} mb={3} align="center" color="primary">
            ERP Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email *"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
            <TextField
              label="Password *"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontWeight: 600, fontSize: '1.1rem', borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login; 