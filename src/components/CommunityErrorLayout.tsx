'use client';

import React from 'react';
import styled from 'styled-components';
import CategoryTabs from '@/app/community/components/CategoryTabs';
import CommunityLayout from '@/app/community/components/CommunityLayout';
import BottomNavigation from '@/components/BottomNavigation';
import ErrorPage from '@/components/ErrorPage';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
`;

interface CommunityErrorLayoutProps {
  message?: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
  backButtonText?: string;
}

const CommunityErrorLayout: React.FC<CommunityErrorLayoutProps> = ({
  message = '오류가 발생했습니다.',
  onBackClick,
  showBackButton = true,
  backButtonText = '돌아가기',
}) => {
  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <ErrorPage
          message={message}
          onBackClick={onBackClick}
          showBackButton={showBackButton}
          backButtonText={backButtonText}
        />
      </CommunityLayout>
      <BottomNavigation />
    </Container>
  );
};

export default CommunityErrorLayout;
