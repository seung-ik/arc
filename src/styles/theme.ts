export const theme = {
  colors: {
    // Primary colors
    primary: '#0070f3',
    primaryHover: '#0051cc',
    primaryLight: '#e6f3ff',

    // Secondary colors
    secondary: '#6c757d',
    secondaryHover: '#5a6268',
    secondaryLight: '#f8f9fa',

    // Text colors
    textBlack: '#000000',
    textGray: '#6c757d',
    textLightGray: '#9ca3af',
    textWhite: '#ffffff',

    // Background colors
    background: '#ffffff',
    backgroundGray: '#f8f9fa',
    backgroundDark: '#f1f1f1',

    // Border colors
    border: '#e1e1e1',
    borderLight: '#f1f1f1',

    // Status colors
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  },

  // Typography
  typography: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
};

export type Theme = typeof theme;
