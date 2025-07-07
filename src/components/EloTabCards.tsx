'use client';

import styled from 'styled-components';
import { useRouter, usePathname } from 'next/navigation';

const TabContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.lg} ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.colors.background};
`;

const TabCard = styled.button<{ $active: boolean }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  border: 1.5px solid
    ${(props) => (props.$active ? props.theme.colors.primary : props.theme.colors.border)};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: ${(props) => props.theme.spacing.lg} ${(props) => props.theme.spacing.lg};
  text-align: left;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
  outline: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 80px;
  max-height: 110px;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const TabIcon = styled.div`
  font-size: 1.7rem;
  margin-right: ${(props) => props.theme.spacing.md};
  margin-bottom: 0;
`;

const TabTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const TabTitle = styled.div`
  color: ${(props) => props.theme.colors.textBlack};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  margin-bottom: 0;
`;

const TabDesc = styled.div`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export default function EloTabCards() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      key: 'management',
      label: '매치관리',
      icon: '🏓',
      desc: '신청받은 매치 승인/거절',
      href: '/elo/management',
      active: pathname === '/elo/management',
    },
    {
      key: 'history',
      label: '매치 히스토리',
      icon: '📊',
      desc: '과거 기록과 Elo 점수 변화',
      href: '/elo/history',
      active: pathname === '/elo/history',
    },
  ];

  return (
    <TabContainer>
      {tabs.map((tab) => (
        <TabCard
          key={tab.key}
          $active={tab.active}
          onClick={() => router.push(tab.href)}
          type="button"
        >
          <TabIcon>{tab.icon}</TabIcon>
          <TabTextBox>
            <TabTitle>{tab.label}</TabTitle>
            <TabDesc>{tab.desc}</TabDesc>
          </TabTextBox>
        </TabCard>
      ))}
    </TabContainer>
  );
}
