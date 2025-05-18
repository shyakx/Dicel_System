import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const logs = [
  { id: 1, user: 'Admin', action: 'Created Employee', date: '2024-05-17 10:00' },
  { id: 2, user: 'HR', action: 'Processed Payroll', date: '2024-05-17 09:30' },
];

const AuditLogs = () => (
  <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', mt: 4 }}>
    <Typography variant="h4" fontWeight={700} mb={3} color="primary">
      Audit Logs
    </Typography>
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.user}</TableCell>
              <TableCell>{row.action}</TableCell>
              <TableCell>{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default AuditLogs; 