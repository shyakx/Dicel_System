import { useState, useContext } from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Button, Snackbar, Alert, Divider, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// We'll create a ThemeContext for dark mode
import { ThemeContext } from '../contexts/ThemeContext';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
];

const Settings = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [language, setLanguage] = useState('en');
  const [profile, setProfile] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [password, setPassword] = useState({ old: '', new: '', confirm: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
    }, 1000);
  };

  const handleDelete = () => {
    setShowDelete(false);
    setDeleteSuccess(true);
    // Here you would call your API to delete the account
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 9 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">
        System Settings
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
        {/* Profile Section */}
        <Typography variant="h6" mb={1}>Profile</Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={profile.name}
          onChange={e => setProfile({ ...profile, name: e.target.value })}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={profile.email}
          onChange={e => setProfile({ ...profile, email: e.target.value })}
        />
        <FormControlLabel
          control={<Switch checked={profileVisible} onChange={e => setProfileVisible(e.target.checked)} />}
          label="Profile Visible to Others"
        />
        <Divider sx={{ my: 3 }} />
        {/* Language Section */}
        <Typography variant="h6" mb={1}>Language</Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          select
          label="Language"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          fullWidth
          margin="normal"
        >
          {languages.map(lang => (
            <MenuItem key={lang.code} value={lang.code}>{lang.label}</MenuItem>
          ))}
        </TextField>
        <Divider sx={{ my: 3 }} />
        {/* Preferences Section */}
        <Typography variant="h6" mb={1}>Preferences</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={<Switch checked={notifications} onChange={e => setNotifications(e.target.checked)} />}
          label="Enable Notifications"
        />
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />}
          label="Dark Mode"
        />
        <Divider sx={{ my: 3 }} />
        {/* Change Password Section */}
        <Typography variant="h6" mb={1}>Change Password</Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          label="Old Password"
          type="password"
          fullWidth
          margin="normal"
          value={password.old}
          onChange={e => setPassword({ ...password, old: e.target.value })}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={password.new}
          onChange={e => setPassword({ ...password, new: e.target.value })}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          margin="normal"
          value={password.confirm}
          onChange={e => setPassword({ ...password, confirm: e.target.value })}
        />
        <Divider sx={{ my: 3 }} />
        {/* Danger Zone */}
        <Typography variant="h6" mb={1} color="error">Danger Zone</Typography>
        <Divider sx={{ mb: 2 }} />
        <Button variant="outlined" color="error" onClick={() => setShowDelete(true)} sx={{ fontWeight: 600 }}>
          Delete Account
        </Button>
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
            sx={{ px: 4, py: 1, fontWeight: 600, borderRadius: 2 }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Paper>
      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={deleteSuccess} autoHideDuration={2000} onClose={() => setDeleteSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="info" sx={{ width: '100%' }}>
          Account deleted (simulated)
        </Alert>
      </Snackbar>
      <Dialog open={showDelete} onClose={() => setShowDelete(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>Are you sure you want to delete your account? This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 