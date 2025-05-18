import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from './theme';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Assets from './pages/Assets';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/*"
              element={
                <Box sx={{ display: 'flex' }}>
                  <Sidebar />
                  <Box sx={{ flexGrow: 1, ml: '240px' }}>
                    <Topbar />
                    <Box sx={{ p: 3 }}>
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'hr', 'finance', 'operations', 'client']}>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/employees/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'hr']}>
                              <Employees />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/payroll/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'finance']}>
                              <Payroll />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/assets/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'operations']}>
                              <Assets />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/clients/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'operations']}>
                              <Clients />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/invoices/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'finance']}>
                              <Invoices />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/settings/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin']}>
                              <Settings />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Box>
                  </Box>
                </Box>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CustomThemeProvider } from './contexts/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from './theme';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Assets from './pages/Assets';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/*"
              element={
                <Box sx={{ display: 'flex' }}>
                  <Sidebar />
                  <Box sx={{ flexGrow: 1, ml: '240px' }}>
                    <Topbar />
                    <Box sx={{ p: 3 }}>
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'hr', 'finance', 'operations', 'client']}>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/employees/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'hr']}>
                              <Employees />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/payroll/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'finance']}>
                              <Payroll />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/assets/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'operations']}>
                              <Assets />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/clients/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'operations']}>
                              <Clients />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/invoices/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'finance']}>
                              <Invoices />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/settings/*"
                          element={
                            <ProtectedRoute allowedRoles={['admin']}>
                              <Settings />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Box>
                  </Box>
                </Box>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App; 