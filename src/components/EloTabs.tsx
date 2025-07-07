'use client';

import styled from 'styled-components';
import { useState } from 'react';

const TabContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
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
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.lg};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.$isActive ? props.theme.colors.primary : 'transparent')};
  color: ${(props) => (props.$isActive ? props.theme.colors.primary : props.theme.colors.textGray)};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) =>
    props.$isActive
      ? props.theme.typography.fontWeights.medium
      : props.theme.typography.fontWeights.normal};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: ${(props) => props.theme.spacing.lg};
`;

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const MatchCard = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const OpponentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const OpponentId = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textBlack};
`;

const SportBadge = styled.span`
  background-color: ${(props) => props.theme.colors.primaryLight};
  color: ${(props) => props.theme.colors.primary};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const MatchDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ResultInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const ResultBadge = styled.span<{ $isWin: boolean }>`
  background-color: ${(props) =>
    props.$isWin ? props.theme.colors.success : props.theme.colors.error};
  color: ${(props) => props.theme.colors.textWhite};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const DateText = styled.span`
  color: ${(props) => props.theme.colors.textLightGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`;

const ActionButton = styled.button<{ $variant: 'accept' | 'reject' }>`
  flex: 1;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${(props) =>
    props.$variant === 'accept' ? props.theme.colors.success : props.theme.colors.error};
  color: ${(props) => props.theme.colors.textWhite};

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xl};
  color: ${(props) => props.theme.colors.textLightGray};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${(props) => props.theme.spacing.md};
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
          <TabButton $isActive={activeTab === 'history'} onClick={() => onTabChange('history')}>
            히스토리
          </TabButton>
        </TabItem>
      </TabList>
    </TabContainer>
  );
}
