export const theme = {
  colors: {
    // Primary colors
    primary: '#23424A', // 메인 컬러 (딥 블루그린)
    primaryHover: '#1a3137', // 호버 시 더 어두운 톤
    primaryLight: '#e2f1f3', // 밝은 톤 (배경/선택 상태 등에 사용)

    // Secondary colors
    secondary: '#E8C87D', // 메인 세컨더리 (따뜻한 골드 베이지)
    secondaryHover: '#d2b467', // 호버용으로 살짝 어두운 골드톤
    secondaryLight: '#fff7e3', // 아주 연한 베이지톤, 배경/포커스 등에 적합

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
    success: '#6CBF84',
    warning: '#ffc107',
    error: '#D9675F',
    info: '#17a2b8',

    // Post type colors
    postType: {
      general: {
        background: '#e6f3ff',
        text: '#0070f3',
      },
      match: {
        background: '#e8f5e8',
        text: '#4caf50',
      },
      mentor: {
        background: '#f3e5f5',
        text: '#9c27b0',
      },
      notice: {
        background: '#fff3cd',
        text: '#856404',
      },
    },
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
      bold: 800,
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
    '2xl': '24px',
  },
};

export type Theme = typeof theme;
