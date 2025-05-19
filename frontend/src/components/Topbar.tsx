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
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [msgAnchorEl, setMsgAnchorEl] = useState<null | HTMLElement>(null);

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
  const handleNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };
  const handleMessages = (event: React.MouseEvent<HTMLElement>) => {
    setMsgAnchorEl(event.currentTarget);
  };
  const handleMsgClose = () => {
    setMsgAnchorEl(null);
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      height: 64,
      px: 3,
      bgcolor: '#f4f6fa',
      borderBottom: 'none',
      position: 'fixed',
      top: 0,
      left: '260px',
      width: 'calc(100vw - 260px)',
      zIndex: 1100,
      boxShadow: '0 2px 8px 0 rgba(70,102,229,0.06)',
      overflowX: 'auto',
      overflowY: 'hidden',
      whiteSpace: 'nowrap',
    }}>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ flexShrink: 0, ml: 1 }}>
        ERP SYSTEM
      </Typography>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper component="form" sx={{ display: 'flex', alignItems: 'center', width: 350, px: 2, py: 0.5, boxShadow: 0, borderRadius: 2, bgcolor: '#e3eafe' }}>
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search for..." inputProps={{ 'aria-label': 'search' }} />
          <IconButton type="submit" sx={{ p: '10px', bgcolor: '#4666E5', color: 'white', borderRadius: 2, '&:hover': { bgcolor: '#274BBA' } }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
        <IconButton size="medium" sx={{ width: 40, height: 40, bgcolor: '#e3eafe', color: '#4666E5', borderRadius: 2, '&:hover': { bgcolor: '#d0dbfa' }, p: 0 }} onClick={handleNotifications}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu anchorEl={notifAnchorEl} open={Boolean(notifAnchorEl)} onClose={handleNotifClose} PaperProps={{ sx: { borderRadius: 3, minWidth: 220, boxShadow: '0 4px 24px rgba(70,102,229,0.10)' } }}>
          <MenuItem disabled>No new notifications</MenuItem>
        </Menu>
        <IconButton size="medium" sx={{ width: 40, height: 40, bgcolor: '#e3eafe', color: '#4666E5', borderRadius: 2, '&:hover': { bgcolor: '#d0dbfa' }, p: 0 }} onClick={handleMessages}>
          <Badge badgeContent={7} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <Menu anchorEl={msgAnchorEl} open={Boolean(msgAnchorEl)} onClose={handleMsgClose} PaperProps={{ sx: { borderRadius: 3, minWidth: 220, boxShadow: '0 4px 24px rgba(70,102,229,0.10)' } }}>
          <MenuItem disabled>No new messages</MenuItem>
        </Menu>
        <IconButton onClick={handleMenu} size="medium" sx={{ width: 40, height: 40, bgcolor: '#e3eafe', color: '#4666E5', borderRadius: 2, '&:hover': { bgcolor: '#d0dbfa' }, p: 0 }}>
          <Avatar alt={user?.firstName || 'User'} src="/avatar.png" sx={{ width: 32, height: 32 }} />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1, color: '#222B45' }}>
          {user ? `${user.firstName} ${user.lastName}` : 'User'}
        </Typography>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} PaperProps={{ sx: { borderRadius: 3, minWidth: 180, boxShadow: '0 4px 24px rgba(70,102,229,0.10)', p: 1 } }}>
          <MenuItem sx={{ justifyContent: 'center', p: 0 }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 1 }}>
              <Box component="button" onClick={handleLogout} sx={{ bgcolor: '#FF6F61', color: 'white', border: 'none', borderRadius: 2, px: 3, py: 1, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(70,102,229,0.08)', '&:hover': { bgcolor: '#E55B50' } }}>Logout</Box>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar; 