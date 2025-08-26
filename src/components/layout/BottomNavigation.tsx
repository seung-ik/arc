'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { TAB_ICONS } from '@/assets';

const NavigationContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.background};
  // border-top: 1px solid ${props => props.theme.colors.border};
  z-index: 1000;
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
  const router = useRouter();

  const handleCommunityClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 로컬스토리지에서 마지막 커뮤니티 종목 가져오기
    const lastCategory =
      localStorage.getItem('lastCommunityCategory') || '자유글';

    // 종목별 경로 매핑 (ROUTES 상수 사용)
    const categoryRoutes: Record<string, string> = {
      자유글: ROUTES.community.root,
      테니스: ROUTES.community.tennis,
      배드민턴: ROUTES.community.badminton,
      탁구: ROUTES.community.tableTennis,
      당구: ROUTES.community.billiards,
      바둑: ROUTES.community.go,
      체스: ROUTES.community.chess,
      공지사항: ROUTES.community.notice,
    };

    const targetRoute = categoryRoutes[lastCategory] || ROUTES.community.root;
    router.push(targetRoute);
  };

  // 탭 활성화 상태 확인 함수
  const isTabActive = (tabPath: string, pathname: string): boolean => {
    const pathMappings: Record<string, string[]> = {
      [ROUTES.community.root]: ['/community'],
      [ROUTES.elo.management]: ['/elo'],
      [ROUTES.profile.root]: ['/profile'],
      [ROUTES.leaderboard.root]: ['/leaderboard'],
    };

    const pathsToCheck = pathMappings[tabPath];
    if (pathsToCheck) {
      return pathsToCheck.some(path => pathname.startsWith(path));
    }

    return pathname === tabPath;
  };

  const tabs = [
    { path: ROUTES.elo.management, label: '매치', icon: TAB_ICONS.SCORE },
    {
      path: ROUTES.community.root,
      label: '커뮤니티',
      icon: TAB_ICONS.COMMUNITY,
      onClick: handleCommunityClick,
    },
    {
      path: ROUTES.leaderboard.root,
      label: '랭킹',
      icon: TAB_ICONS.RANK,
    },
    { path: ROUTES.profile.root, label: '내 정보', icon: TAB_ICONS.USER },
  ];

  return (
    <NavigationContainer>
      <TabList>
        {tabs.map(tab => {
          const isActive = isTabActive(tab.path, pathname);

          return (
            <TabItem key={tab.label}>
              {tab.onClick ? (
                <TabLink $isActive={isActive} onClick={tab.onClick}>
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
              ) : (
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
              )}
            </TabItem>
          );
        })}
      </TabList>
    </NavigationContainer>
  );
}
