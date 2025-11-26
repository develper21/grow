import { createTheme } from '@mui/material/styles';

const midnight = '#050816';
const deepSpace = '#0f172a';
const slate = '#1f2a44';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c5dfa',
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#f8fafc',
    },
    secondary: {
      main: '#22d3ee',
      light: '#67e8f9',
      dark: '#0e7490',
      contrastText: '#04101f',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#047857',
    },
    warning: {
      main: '#f59e0b',
      light: '#fcd34d',
      dark: '#b45309',
    },
    error: {
      main: '#fb7185',
      light: '#fda4af',
      dark: '#be123c',
    },
    info: {
      main: '#38bdf8',
      light: '#7dd3fc',
      dark: '#0ea5e9',
    },
    background: {
      default: midnight,
      paper: '#101626',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#9ca3af',
    },
    divider: 'rgba(148, 163, 184, 0.24)',
  },
  typography: {
    fontFamily: [
      'Space Grotesk',
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
      fontSize: '3.75rem',
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 600,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontSize: '2.1rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1.05rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
      color: '#a5b4fc',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.04em',
    },
    subtitle1: {
      color: '#a1a1aa',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: Array.from({ length: 25 }).map(() => 'none') as unknown as typeof createTheme.arguments,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `radial-gradient(circle at top, rgba(124,93,250,0.25), transparent 40%), radial-gradient(circle at 10% 20%, rgba(34,211,238,0.15), transparent 30%)`,
          backgroundColor: midnight,
          minHeight: '100vh',
          color: '#f8fafc',
        },
        '*': {
          scrollbarColor: '#7c5dfa rgba(148,163,184,0.3)',
        },
        '*::-webkit-scrollbar': {
          width: '10px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(15,23,42,0.6)',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(124,93,250,0.7)',
          borderRadius: 999,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: 8,
          padding: '0.85rem 1.75rem',
          fontSize: '0.95rem',
          letterSpacing: '0.05em',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'none',
          border: ownerState.variant === 'outlined' ? '1px solid rgba(255,255,255,0.2)' : 'none',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'none',
          },
        }),
        containedPrimary: {
          backgroundImage: 'linear-gradient(120deg, #7c5dfa, #22d3ee)',
          color: '#050816',
        },
        outlinedPrimary: {
          color: '#e0e7ff',
          '&:hover': {
            backgroundColor: 'rgba(124,93,250,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#101626',
          borderRadius: 8,
          border: '1px solid rgba(124,93,250,0.2)',
          backdropFilter: 'blur(18px)',
          transition: 'border-color 0.3s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f162b',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: slate,
            border: '1px solid rgba(255,255,255,0.08)',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(124,93,250,0.6)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#22d3ee',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          letterSpacing: '0.05em',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, rgba(15,23,42,0.95), rgba(5,8,22,0.98))',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginInline: 12,
          marginBlock: 4,
          '&.Mui-selected': {
            background: 'linear-gradient(120deg, rgba(124,93,250,0.35), rgba(34,211,238,0.2))',
            boxShadow: '0 10px 30px rgba(124,93,250,0.35)',
          },
          '&:hover': {
            backgroundColor: 'rgba(148,163,184,0.15)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #7c5dfa, #22d3ee)',
          color: '#050816',
          fontWeight: 700,
        },
      },
    },
  },
});
