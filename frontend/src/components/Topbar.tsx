import { AppBar, Toolbar, Box, Typography, InputBase, IconButton, Badge, Avatar, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import { useAuth } from '../contexts/AuthContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

const Topbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    handleClose();
    window.location.href = '/login';
  };
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      height: 64,
      px: 2,
      bgcolor: '#fff',
      borderBottom: '1px solid',
      borderColor: 'divider',
      position: 'fixed',
      top: 0,
      left: '260px',
      width: 'calc(100vw - 260px)',
      zIndex: 1100,
      overflowX: 'auto',
      overflowY: 'hidden',
      whiteSpace: 'nowrap',
    }}>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ flexShrink: 0 }}>
        ERP SYSTEM
      </Typography>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.default', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid #e0e7ef', ml: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Paper component="form" sx={{ display: 'flex', alignItems: 'center', width: 350, px: 2, py: 0.5, boxShadow: 0, borderRadius: 2, bgcolor: '#f4f6fa' }}>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search for..." inputProps={{ 'aria-label': 'search' }} />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon color="primary" />
            </IconButton>
          </Paper>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={7} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleMenu} size="small" sx={{ ml: 1 }}>
                <Avatar alt={user?.firstName || 'User'} src="/avatar.png" />
              </IconButton>
              <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </Typography>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Topbar; 