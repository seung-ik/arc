'use client';

import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  padding-bottom: 80px; /* 하단 네비게이션 높이만큼 패딩 */
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.textBlack};
  font-size: ${(props) => props.theme.typography.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  padding: ${(props) => props.theme.spacing.xl};
`;

export default function ProfilePage() {
  return (
    <Container>
      <Content>/profile</Content>
      <BottomNavigation />
    </Container>
  );
}
