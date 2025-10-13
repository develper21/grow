import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
      contrastText: '#fff',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    info: {
      main: '#0284c7',
      light: '#0ea5e9',
      dark: '#0369a1',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.7,
      fontWeight: 400,
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 1px 3px 0 rgb(0 0 0 / 0.12), 0 1px 2px 0 rgb(0 0 0 / 0.24)',
    '0 3px 6px 0 rgb(0 0 0 / 0.15), 0 2px 4px 0 rgb(0 0 0 / 0.12)',
    '0 4px 8px 0 rgb(0 0 0 / 0.15), 0 3px 6px 0 rgb(0 0 0 / 0.12)',
    '0 6px 12px 0 rgb(0 0 0 / 0.15), 0 4px 8px 0 rgb(0 0 0 / 0.12)',
    '0 8px 16px 0 rgb(0 0 0 / 0.15), 0 6px 12px 0 rgb(0 0 0 / 0.12)',
    '0 12px 24px 0 rgb(0 0 0 / 0.15), 0 8px 16px 0 rgb(0 0 0 / 0.12)',
    '0 16px 32px 0 rgb(0 0 0 / 0.15), 0 12px 24px 0 rgb(0 0 0 / 0.12)',
    '0 20px 40px 0 rgb(0 0 0 / 0.15), 0 16px 32px 0 rgb(0 0 0 / 0.12)',
    '0 24px 48px 0 rgb(0 0 0 / 0.15), 0 20px 40px 0 rgb(0 0 0 / 0.12)',
    '0 28px 56px 0 rgb(0 0 0 / 0.15), 0 24px 48px 0 rgb(0 0 0 / 0.12)',
    '0 32px 64px 0 rgb(0 0 0 / 0.15), 0 28px 56px 0 rgb(0 0 0 / 0.12)',
    '0 36px 72px 0 rgb(0 0 0 / 0.15), 0 32px 64px 0 rgb(0 0 0 / 0.12)',
    '0 40px 80px 0 rgb(0 0 0 / 0.15), 0 36px 72px 0 rgb(0 0 0 / 0.12)',
    '0 44px 88px 0 rgb(0 0 0 / 0.15), 0 40px 80px 0 rgb(0 0 0 / 0.12)',
    '0 48px 96px 0 rgb(0 0 0 / 0.15), 0 44px 88px 0 rgb(0 0 0 / 0.12)',
    '0 52px 104px 0 rgb(0 0 0 / 0.15), 0 48px 96px 0 rgb(0 0 0 / 0.12)',
    '0 56px 112px 0 rgb(0 0 0 / 0.15), 0 52px 104px 0 rgb(0 0 0 / 0.12)',
    '0 60px 120px 0 rgb(0 0 0 / 0.15), 0 56px 112px 0 rgb(0 0 0 / 0.12)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 32px',
          fontSize: '0.95rem',
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: '0.025em',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#fff',
            '& fieldset': {
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: '#2563eb',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});
