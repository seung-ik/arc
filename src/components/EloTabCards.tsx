'use client';

import styled from 'styled-components';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

const TabContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.background};
  width: 100%;

  /* 화면 넓을 때: 반반씩 꽉 채우기 */
  @media (min-width: 768px) {
    flex-wrap: nowrap;
    overflow-x: visible;
  }

  @media (min-width: 1200px) {
    width: 1100px;
    padding: 0;
    padding-top: ${(props) => props.theme.spacing.md};
  }
`;

const TabCard = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};
  background-color: ${(props) => props.theme.colors.background};
  border: 1.5px solid
    ${(props) => (props.$active ? props.theme.colors.primary : props.theme.colors.border)};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  text-align: left;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
  outline: none;
  word-break: keep-all;
  word-wrap: break-word;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: ${(props) => props.theme.colors.primary};
  }

  /* 화면 넓을 때: 반반씩 꽉 채우기 */
  @media (min-width: 768px) {
    flex: 1 1 50%;
    padding: ${(props) => props.theme.spacing.md};
    min-width: 200px;
  }

  /* 화면 작을 때: 최소 너비로 컴팩트하게 */
  @media (max-width: 767px) {
    flex: 0 0 auto;
    padding: ${(props) => props.theme.spacing.sm};
    min-width: 120px;
    max-width: 140px;
  }
`;

const TabIcon = styled.div`
  font-size: 1.7rem;
  margin-bottom: 0;

  /* 화면 넓을 때 */
  @media (min-width: 768px) {
    margin-right: ${(props) => props.theme.spacing.md};
  }

  /* 화면 작을 때 */
  @media (max-width: 767px) {
    margin-right: ${(props) => props.theme.spacing.sm};
  }
`;

const TabTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const TabTitle = styled.div`
  color: ${(props) => props.theme.colors.textBlack};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  margin-bottom: 0;
  word-break: keep-all;
  word-wrap: break-word;

  /* 화면 넓을 때 */
  @media (min-width: 768px) {
    font-size: ${(props) => props.theme.typography.fontSizes.base};
  }

  /* 화면 작을 때 */
  @media (max-width: 767px) {
    font-size: ${(props) => props.theme.typography.fontSizes.sm};
  }
`;

const TabDesc = styled.div`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  word-break: keep-all;
  word-wrap: break-word;

  /* 화면 넓을 때만 표시 */
  @media (min-width: 768px) {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  /* 화면 작을 때는 숨김 */
  @media (max-width: 767px) {
    display: none;
  }
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
      href: ROUTES.elo.management,
      active: pathname === ROUTES.elo.management,
    },
    {
      key: 'history',
      label: '매치 히스토리',
      icon: '📊',
      desc: '과거 기록과 Elo 점수 변화',
      href: ROUTES.elo.history,
      active: pathname === ROUTES.elo.history,
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
