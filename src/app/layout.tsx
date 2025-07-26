import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/registry';
import GlobalStyle from '@/styles/GlobalStyle';
import ThemeWrapper from '@/components/ThemeWrapper';
import Providers from '@/components/Providers';
import { GlobalWrapper } from '@/components/style';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Elo 기반 커뮤니티 플랫폼',
  description: '실력 기반 매칭과 토큰 보상 시스템을 제공하는 스포츠 커뮤니티',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StyledComponentsRegistry>
          <ThemeWrapper>
            <Providers>
              <GlobalStyle />
              <GlobalWrapper>{children}</GlobalWrapper>
            </Providers>
          </ThemeWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
