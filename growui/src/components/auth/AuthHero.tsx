import { Box, Typography } from '@mui/material';

export const AuthHero = () => (
  <Box
    sx={{
      flex: { xs: 'unset', md: 1 },
      minHeight: { xs: 360, md: '100vh' },
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 25% 25%, #0b1224 0%, #010104 65%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: { xs: 3, md: 4 },
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15), transparent 55%)',
        opacity: 0.35,
        mixBlendMode: 'screen',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '-20%',
        bottom: '-20%',
        right: '-30%',
        width: '65%',
        background: 'linear-gradient(270deg, rgba(255,255,255,0.6), rgba(35,54,94,0.05))',
        filter: 'blur(8px)',
        opacity: 0.95,
        animation: 'beamPulse 12s ease-in-out infinite',
      },
      '@keyframes beamPulse': {
        '0%': { transform: 'translateX(0)' },
        '50%': { transform: 'translateX(-4%) scale(1.02)' },
        '100%': { transform: 'translateX(0)' },
      },
    }}
  >
    <Box sx={{ position: 'absolute', top: 32, right: 40, letterSpacing: '0.4em', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
      G / COMMAND
    </Box>
    <Box
      sx={{
        position: 'relative',
        zIndex: 1,
        width: 'min(420px, 70%)',
        aspectRatio: '1',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(6px)',
        background: 'radial-gradient(circle, rgba(255,255,255,0.04), rgba(4,6,10,0.92))',
        boxShadow: '0 60px 120px rgba(0,0,0,0.65), inset 0 0 80px rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '8rem', md: '10rem' },
          fontWeight: 700,
          color: 'rgba(255,255,255,0.08)',
          letterSpacing: '-0.05em',
        }}
      >
        G
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          width: '60%',
          height: '12px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.45), rgba(255,255,255,0))',
          transform: 'rotate(-25deg)',
          borderRadius: 999,
          boxShadow: '0 0 35px rgba(255,255,255,0.4)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: '12%',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
          opacity: 0.4,
        }}
      />
    </Box>
  </Box>
);
