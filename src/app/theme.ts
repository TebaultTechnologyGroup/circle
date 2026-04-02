import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // blue-500
      dark: '#2563eb', // blue-600
      light: '#60a5fa', // blue-400
    },
    secondary: {
      main: '#a855f7', // purple-500
      dark: '#9333ea', // purple-600
      light: '#c084fc', // purple-400
    },
    success: {
      main: '#10b981', // green-500
      dark: '#059669', // green-600
    },
    warning: {
      main: '#f59e0b', // amber-500
      dark: '#d97706', // amber-600
    },
    error: {
      main: '#ef4444', // red-500
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});