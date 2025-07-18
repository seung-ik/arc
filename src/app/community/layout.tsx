'use client';

import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding-bottom: 80px; /* BottomNavigation 높이만큼 패딩 */
`;

export default function CommunityLayout({
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
