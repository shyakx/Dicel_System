import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({ darkMode: false, setDarkMode: () => {} });

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#4666E5',
        },
        background: {
          default: darkMode ? '#181A20' : '#F4F6FA',
          paper: darkMode ? '#23272F' : '#fff',
        },
        text: darkMode
          ? {
              primary: '#fff',
              secondary: '#b0b0b0',
            }
          : {
              primary: '#222B45',
              secondary: '#8F9BB3',
            },
      },
      typography: {
        fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
      },
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext }; 