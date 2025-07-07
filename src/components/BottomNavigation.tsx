'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

const NavigationContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${(props) => props.theme.colors.background};
  border-top: 1px solid ${(props) => props.theme.colors.border};
  z-index: 9999;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
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

const TabLink = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  text-decoration: none;
  color: ${(props) => (props.$isActive ? props.theme.colors.primary : props.theme.colors.textGray)};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) =>
    props.$isActive
      ? props.theme.typography.fontWeights.medium
      : props.theme.typography.fontWeights.normal};
  transition: color 0.2s;
  min-height: 60px;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const TabIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const TabLabel = styled.span`
  font-size: 12px;
`;

export default function BottomNavigation() {
  const pathname = usePathname();

  const tabs = [
    { path: ROUTES.elo.management, label: 'Elo', icon: '🏆' },
    { path: ROUTES.profile, label: 'Profile', icon: '👤' },
    { path: ROUTES.community.root, label: 'Community', icon: '💬' },
  ];

  return (
    <NavigationContainer>
      <TabList>
        {tabs.map((tab) => {
          const isActive =
            tab.path === '/community'
              ? pathname.startsWith('/community')
              : tab.path === '/elo/management'
              ? pathname.startsWith('/elo')
              : pathname === tab.path;

          return (
            <TabItem key={tab.label}>
              <Link href={tab.path}>
                <TabLink $isActive={isActive}>
                  <TabIcon>{tab.icon}</TabIcon>
                  <TabLabel>{tab.label}</TabLabel>
                </TabLink>
              </Link>
            </TabItem>
          );
        })}
      </TabList>
    </NavigationContainer>
  );
}
