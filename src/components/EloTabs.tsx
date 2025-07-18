'use client';

import styled from 'styled-components';

const TabContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TabList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TabItem = styled.li`
  flex: 1;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${props => (props.$isActive ? props.theme.colors.primary : 'transparent')};
  color: ${props =>
    props.$isActive ? props.theme.colors.primary : props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props =>
    props.$isActive
      ? props.theme.typography.fontWeights.medium
      : props.theme.typography.fontWeights.normal};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

interface EloTabsProps {
  activeTab: 'management' | 'history';
  onTabChange: (tab: 'management' | 'history') => void;
}

export default function EloTabs({ activeTab, onTabChange }: EloTabsProps) {
  return (
    <TabContainer>
      <TabList>
        <TabItem>
          <TabButton
            $isActive={activeTab === 'management'}
            onClick={() => onTabChange('management')}
          >
            매치관리
          </TabButton>
        </TabItem>
        <TabItem>
          <TabButton
            $isActive={activeTab === 'history'}
            onClick={() => onTabChange('history')}
          >
            히스토리
          </TabButton>
        </TabItem>
      </TabList>
    </TabContainer>
  );
}
