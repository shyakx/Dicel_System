import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const AdminDashboard = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h3" color="primary" gutterBottom>
      Admin Dashboard
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Employees</Typography>
            <Typography variant="h4">120</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Assets</Typography>
            <Typography variant="h4">45</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Clients</Typography>
            <Typography variant="h4">30</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default AdminDashboard; 