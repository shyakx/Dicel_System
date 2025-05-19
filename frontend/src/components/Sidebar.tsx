import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: ['admin', 'hr', 'finance', 'operations', 'client'] },
  { text: 'Employees', icon: <PeopleIcon />, path: '/employees', roles: ['admin', 'hr'] },
  { text: 'Payroll', icon: <MoneyIcon />, path: '/payroll', roles: ['admin', 'finance'] },
  { text: 'Assets', icon: <InventoryIcon />, path: '/assets', roles: ['admin', 'operations'] },
  { text: 'Clients', icon: <BusinessIcon />, path: '/clients', roles: ['admin', 'operations'] },
  { text: 'Invoices', icon: <ReceiptIcon />, path: '/invoices', roles: ['admin', 'finance'] },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['admin'] },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole, logout, user } = useAuth();

  return (
    <Box
      sx={{
        width: 260,
        bgcolor: '#4666E5',
        color: 'white',
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1200,
      }}
    >
      {/* Fixed logo and title */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 1, flexShrink: 0 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 60, marginBottom: 8 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, textAlign: 'center', fontSize: 20, letterSpacing: 0.5, color: 'white', WebkitTextFillColor: 'white' }} color="white">
          ERP SYSTEM
        </Typography>
        <Divider sx={{ width: '80%', mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
      </Box>
      {/* Scrollable menu */}
      <Box sx={{ flex: 1, width: '100%', overflowY: 'auto' }}>
        <Typography variant="caption" sx={{ pl: 2, alignSelf: 'flex-start', mb: 0.5, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.7)' }}>
          MANAGEMENT
        </Typography>
        <List sx={{ width: '100%' }}>
          {menuItems.slice(0, 6).map((item) => {
            if (!hasRole(item.roles)) return null;
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0,0,0,0.12)',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.18)',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  pl: 3,
                  py: 1.2,
                  color: 'white',
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ width: '80%', my: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Typography variant="caption" sx={{ pl: 2, alignSelf: 'flex-start', mb: 0.5, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.7)' }}>
          REPORTS
        </Typography>
        <List sx={{ width: '100%' }}>
          {menuItems.slice(6).map((item) => {
            if (!hasRole(item.roles)) return null;
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0,0,0,0.12)',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.18)',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  pl: 3,
                  py: 1.2,
                  color: 'white',
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
      </Box>
      {/* Logout button at the bottom */}
      <Box sx={{ width: '100%', p: 2, borderTop: '1px solid #e0e7ef', mt: 'auto' }}>
        <Divider sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
        <ListItem 
          button 
          onClick={logout} 
          sx={{ 
            justifyContent: 'center', 
            color: 'white', 
            borderRadius: 2, 
            bgcolor: '#FF6F61', 
            '&:hover': { bgcolor: '#E55B50', color: 'white' },
            mt: 2,
            py: 2
          }}
        >
          <ListItemText primary="Logout" sx={{ textAlign: 'center' }} />
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar; 