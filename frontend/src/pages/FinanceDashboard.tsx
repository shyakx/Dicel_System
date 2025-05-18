import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const FinanceDashboard = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h3" color="primary" gutterBottom>
      Finance Dashboard
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">$500,000</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Invoices</Typography>
            <Typography variant="h4">120</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6">Overdue Payments</Typography>
            <Typography variant="h4">5</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default FinanceDashboard; 