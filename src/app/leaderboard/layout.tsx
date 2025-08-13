'use client';

import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  max-width: 768px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primaryLight} 0%,
    ${props => props.theme.colors.secondaryLight} 90%,
    ${props => props.theme.colors.background} 100%
  );
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding-bottom: 80px; /* BottomNavigation 높이만큼 패딩 */
`;

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutContainer>
      <ContentWrapper>{children}</ContentWrapper>
      <BottomNavigation />
    </LayoutContainer>
  );
}
