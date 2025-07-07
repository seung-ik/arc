'use client';

import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
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

export default function QnaPage() {
  return (
    <Container>
      <CategoryTabs />
      <Content>/community/qna</Content>
      <BottomNavigation />
    </Container>
  );
}
