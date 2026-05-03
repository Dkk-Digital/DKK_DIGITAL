import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useThemeToggle = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme_mode');
    return saved === 'dark';
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      localStorage.setItem('theme_mode', nextMode ? 'dark' : 'light');
      return nextMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.body.style.background = '#0f172a';
      document.body.style.color = '#f8fafc';
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.style.background = '#f8fafc';
      document.body.style.color = '#1e293b';
    }
  }, [isDarkMode]);

  const theme = useMemo(() => {
    let baseTheme = createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        primary: {
          main: '#4f46e5',
          light: '#818cf8',
          dark: '#3730a3',
          contrastText: '#fff',
        },
        secondary: {
          main: '#d946ef',
          light: '#f472b6',
          dark: '#a21caf',
          contrastText: '#fff',
        },
        background: {
          default: isDarkMode ? '#0f172a' : '#f8fafc',
          paper: isDarkMode ? '#1e293b' : '#ffffff',
        },
        text: {
          primary: isDarkMode ? '#f8fafc' : '#1e293b',
          secondary: isDarkMode ? '#94a3b8' : '#64748b',
        },
      },
      typography: {
        fontFamily: '"Inter", "Poppins", "Segoe UI", "Roboto", sans-serif',
        h1: { fontWeight: 800, letterSpacing: '-1px' },
        h2: { fontWeight: 800, letterSpacing: '-0.8px' },
        h3: { fontWeight: 700, letterSpacing: '-0.6px' },
        h4: { fontWeight: 700, letterSpacing: '-0.4px' },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
      },
      shape: {
        borderRadius: 14,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '12px',
              padding: '10px 24px',
              boxShadow: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isDarkMode ? '0 8px 24px rgba(79,70,229,0.3)' : '0 8px 24px rgba(79,70,229,0.18)',
              },
            },
            containedPrimary: {
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)',
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: '16px',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.03)',
              boxShadow: isDarkMode ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(0,0,0,0.03)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: isDarkMode ? '0 20px 45px rgba(0,0,0,0.45)' : '0 20px 45px rgba(0,0,0,0.06)',
                borderColor: 'rgba(79,70,229,0.2)',
              },
            },
          },
        },
      },
    });

    return responsiveFontSizes(baseTheme);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
