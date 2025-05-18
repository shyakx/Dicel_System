import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4666E5', // Sidebar/Main Accent Blue
      light: '#5A7BEF',
      dark: '#274BBA',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00C9A7', // Accent Green
      light: '#5CF2D6',
      dark: '#00997A',
      contrastText: '#fff',
    },
    warning: {
      main: '#FFB547', // Accent Yellow
      contrastText: '#fff',
    },
    background: {
      default: '#F4F6FA', // App background
      paper: '#fff',
    },
    text: {
      primary: '#222B45', // Main text
      secondary: '#8F9BB3', // Subtle text
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(70, 102, 229, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme; 