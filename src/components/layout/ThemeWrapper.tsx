'use client';

import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
