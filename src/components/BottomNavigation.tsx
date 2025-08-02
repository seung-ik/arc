'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { TAB_ICONS } from '@/assets';

const NavigationContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.background};
  // border-top: 1px solid ${props => props.theme.colors.border};
  z-index: 9999;
  box-shadow: 0 -1px 0.5px rgba(0, 0, 0, 0.1);
  max-width: 768px;
  margin: 0 auto;
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
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  text-decoration: none;
  color: ${props => (props.$isActive ? '#000000' : '#999999')};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props =>
    props.$isActive
      ? props.theme.typography.fontWeights.medium
      : props.theme.typography.fontWeights.normal};
  transition: color 0.2s;
  min-height: 60px;
  cursor: pointer;

  &:hover {
    color: #000000;
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
    { path: ROUTES.elo.management, label: '매치', icon: TAB_ICONS.ELO },
    { path: ROUTES.profile.root, label: '내 정보', icon: TAB_ICONS.USER },
    {
      path: ROUTES.community.root,
      label: '커뮤니티',
      icon: TAB_ICONS.COMMUNITY,
    },
  ];

  return (
    <NavigationContainer>
      <TabList>
        {tabs.map(tab => {
          const isActive =
            tab.path === '/community'
              ? pathname.startsWith('/community')
              : tab.path === '/elo/management'
                ? pathname.startsWith('/elo')
                : tab.path === '/profile'
                  ? pathname.startsWith('/profile')
                  : pathname === tab.path;

          return (
            <TabItem key={tab.label}>
              <Link href={tab.path}>
                <TabLink $isActive={isActive}>
                  <TabIcon>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: isActive ? '#000000' : '#999999',
                        WebkitMaskImage: `url(${tab.icon.src})`,
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskSize: 'contain',
                        maskImage: `url(${tab.icon.src})`,
                        maskRepeat: 'no-repeat',
                        maskSize: 'contain',
                      }}
                    />
                  </TabIcon>
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
