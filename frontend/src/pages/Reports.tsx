import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const Reports = () => (
  <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', mt: 4 }}>
    <Typography variant="h4" fontWeight={700} mb={3} color="primary">
      Reports & Analytics
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6">Employee Attendance Report</Typography>
            <Typography variant="body2" color="text.secondary">View detailed attendance analytics for all employees.</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6">Payroll & Finance Report</Typography>
            <Typography variant="body2" color="text.secondary">Analyze payroll, expenses, and financial trends.</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6">Security Operations Report</Typography>
            <Typography variant="body2" color="text.secondary">Review incident logs and security performance.</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default Reports; 