import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const HRDashboard = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h3" color="primary" gutterBottom>
      HR Dashboard
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Attendance</Typography>
            <Typography variant="h4">98%</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Payroll Processed</Typography>
            <Typography variant="h4">$120,000</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Open Positions</Typography>
            <Typography variant="h4">3</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default HRDashboard; 