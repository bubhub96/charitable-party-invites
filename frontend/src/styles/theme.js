export const theme = {
  colors: {
    primary: '#2E7D32', // A warm green that represents giving and growth
    secondary: '#795548', // Earthy brown for warmth
    accent: '#FF8F00', // Warm orange for calls-to-action
    background: {
      main: '#FAFAFA',
      paper: '#FFFFFF',
      alt: '#F5F5F5'
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      light: '#FFFFFF'
    },
    success: '#43A047',
    error: '#D32F2F',
    warning: '#FFA000',
    info: '#1976D2',
    divider: '#E0E0E0'
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      marginBottom: '1rem'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      marginBottom: '0.875rem'
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      marginBottom: '0.75rem'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      marginBottom: '1rem'
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      marginBottom: '0.75rem'
    }
  },
  spacing: (multiplier = 1) => `${8 * multiplier}px`,
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    circle: '50%'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)'
  },
  transitions: {
    standard: '0.3s ease-in-out'
  }
};
