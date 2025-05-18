import { Box, Typography, Paper, Switch, FormControlLabel } from '@mui/material';

const Settings = () => (
  <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
    <Typography variant="h4" fontWeight={700} mb={3} color="primary">
      System Settings
    </Typography>
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
      <FormControlLabel control={<Switch defaultChecked />} label="Enable Notifications" />
      <FormControlLabel control={<Switch />} label="Dark Mode" />
      <FormControlLabel control={<Switch defaultChecked />} label="Auto-Backup Data" />
    </Paper>
  </Box>
);

export default Settings; 