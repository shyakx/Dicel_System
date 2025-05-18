import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const SecurityDashboard = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h3" color="primary" gutterBottom>
      Security Officer Dashboard
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Guards On Duty</Typography>
            <Typography variant="h4">25</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Incidents Today</Typography>
            <Typography variant="h4">2</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Shifts Scheduled</Typography>
            <Typography variant="h4">8</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default SecurityDashboard; 