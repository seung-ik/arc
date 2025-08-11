'use client';

import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';
import WriteButton from '@/components/buttons/WriteButton';
import { ROUTES } from '@/constants/routes';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  max-width: 768px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: rgb(255, 255, 255);
`;
const ContentWrapper = styled.div`
  flex: 1;
  padding-bottom: 80px; /* BottomNavigation 높이만큼 패딩 */
`;

export default function ChessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutContainer>
      <ContentWrapper>{children}</ContentWrapper>
      <WriteButton href={`${ROUTES.community.write}?category=chess`} />
      <BottomNavigation />
    </LayoutContainer>
  );
}
