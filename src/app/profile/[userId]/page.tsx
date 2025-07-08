'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/ProfileHeader';
import GameStatsGrid from '@/components/GameStatsGrid';
import ProfilePostList from '@/components/ProfilePostList';
import { UserProfile, GAME_TYPES } from '@/constants/gameTypes';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  padding-bottom: 80px;
`;

const Content = styled.div`
  flex: 1;
`;

// 임시 데이터 - 실제로는 API에서 가져올 예정
const mockOtherUserProfile: UserProfile = {
  id: '2',
  name: '이영희',
  gameStats: {
    [GAME_TYPES.BILLIARDS]: {
      elo: 1350,
      percentile: 8,
      isActive: true,
      gamesPlayed: 42,
    },
    [GAME_TYPES.TABLE_TENNIS]: {
      elo: 1280,
      percentile: 12,
      isActive: true,
      gamesPlayed: 28,
    },
    [GAME_TYPES.BADMINTON]: {
      elo: 1420,
      percentile: 5,
      isActive: true,
      gamesPlayed: 38,
    },
    [GAME_TYPES.CHESS]: {
      elo: 1550,
      percentile: 1,
      isActive: true,
      gamesPlayed: 67,
    },
    [GAME_TYPES.GO]: {
      elo: 0,
      percentile: 0,
      isActive: false,
      gamesPlayed: 0,
    },
    [GAME_TYPES.TENNIS]: {
      elo: 1200,
      percentile: 20,
      isActive: true,
      gamesPlayed: 15,
    },
  },
};

// 임시 글 데이터 (다른 유저의 글) - 기본값: 숨김
const mockOtherUserPosts = [
  {
    id: 1,
    title: '테니스 라켓 구매 후기',
    content:
      '최근에 Wilson Pro Staff RF97을 구매했습니다. 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다.',
    category: '후기',
    date: '2024-01-15',
    viewCount: 89,
    commentCount: 31,
    showInProfile: false, // 기본값: 숨김
  },
  {
    id: 2,
    title: '바둑 기보 분석',
    content:
      '오늘 프로 기사와의 대국에서 배운 수를 분석해보았습니다. 특히 중반전에서의 포석이 인상적이었어요.',
    category: '분석',
    date: '2024-01-14',
    viewCount: 56,
    commentCount: 18,
    showInProfile: false, // 기본값: 숨김
  },
  {
    id: 3,
    title: '당구 동호회 모집',
    content:
      '서울 강북 지역에서 당구를 치는 동호회를 만들려고 합니다. 실력에 관계없이 즐겁게 치실 분들 모집합니다.',
    category: '모집',
    date: '2024-01-13',
    viewCount: 34,
    commentCount: 12,
    showInProfile: false, // 기본값: 숨김
  },
];

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제로는 API 호출을 여기서 할 예정
    const fetchUserProfile = async () => {
      try {
        // API 호출 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUserProfile(mockOtherUserProfile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <Container>
        <Content>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              fontSize: '18px',
              color: '#666',
            }}
          >
            로딩 중...
          </div>
        </Content>
        <BottomNavigation />
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container>
        <Content>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              fontSize: '18px',
              color: '#666',
            }}
          >
            사용자를 찾을 수 없습니다.
          </div>
        </Content>
        <BottomNavigation />
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <ProfileHeader
          name={userProfile.name}
          profileImage={userProfile.profileImage}
          isMyProfile={false}
        />

        <GameStatsGrid gameStats={userProfile.gameStats} />

        <ProfilePostList posts={mockOtherUserPosts} isMyProfile={false} />
      </Content>
      <BottomNavigation />
    </Container>
  );
}
