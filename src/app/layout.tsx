import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/registry';
import GlobalStyle from '@/styles/GlobalStyle';
import ThemeWrapper from '@/components/layout/ThemeWrapper';
import Providers from '@/components/manager/Providers';

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
  title: 'Trivus',
  description: '종목별 ELO 보드와 토큰 보상 시스템을 제공하는 스포츠 커뮤니티',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Trivus',
    description:
      '종목별 ELO 보드와 토큰 보상 시스템을 제공하는 스포츠 커뮤니티',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trivus - 스포츠 커뮤니티',
      },
    ],
    type: 'website',
    locale: 'ko_KR',
  },
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
              <>{children}</>
            </Providers>
          </ThemeWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
