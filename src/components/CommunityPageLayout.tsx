'use client';

import React from 'react';
import styled from 'styled-components';
import CategoryTabs from '@/app/community/component/CategoryTabs';
import CommunityLayout from '@/app/community/component/CommunityLayout';
import BottomNavigation from '@/components/BottomNavigation';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
`;

interface CommunityPageLayoutProps {
  children: React.ReactNode;
  currentTab?: string;
}

const CommunityPageLayout: React.FC<CommunityPageLayoutProps> = ({
  children,
  currentTab,
}) => {
  return (
    <Container>
      <CategoryTabs currentLabel={currentTab} />
      <CommunityLayout>{children}</CommunityLayout>
      <BottomNavigation />
    </Container>
  );
};

export default CommunityPageLayout;
