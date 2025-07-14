'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/ProfileHeader';
import TokenDisplay from '@/components/TokenDisplay';
import GameStatsGrid from '@/components/GameStatsGrid';
import ProfilePostList from '@/components/ProfilePostList';
import NicknameChangeModal from '@/components/NicknameChangeModal';
import { UserProfile, GAME_TYPES } from '@/constants/gameTypes';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  padding-bottom: 80px; /* 하단 네비게이션 높이만큼 패딩 */
`;

const Content = styled.div`
  flex: 1;
`;

// 임시 데이터 - 실제로는 API에서 가져올 예정
const mockUserProfile: UserProfile = {
  id: '1',
  name: '김철수',
  tokens: 1250,
  gameStats: {
    [GAME_TYPES.BILLIARDS]: {
      elo: 1250,
      percentile: 15,
      isActive: true,
      gamesPlayed: 25,
    },
    [GAME_TYPES.TABLE_TENNIS]: {
      elo: 1180,
      percentile: 25,
      isActive: true,
      gamesPlayed: 18,
    },
    [GAME_TYPES.BADMINTON]: {
      elo: 1320,
      percentile: 8,
      isActive: true,
      gamesPlayed: 32,
    },
    [GAME_TYPES.CHESS]: {
      elo: 1450,
      percentile: 3,
      isActive: true,
      gamesPlayed: 45,
    },
    [GAME_TYPES.GO]: {
      elo: 1100,
      percentile: 30,
      isActive: true,
      gamesPlayed: 12,
    },
    [GAME_TYPES.TENNIS]: {
      elo: 0,
      percentile: 0,
      isActive: false,
      gamesPlayed: 0,
    },
  },
};

// 임시 글 데이터 (기본값: 숨김)
const initialMockPosts = [
  {
    id: 1,
    title: '탁구 동호회 모집합니다!',
    content:
      '매주 토요일 오후에 탁구를 치는 동호회를 만들려고 합니다. 초보자도 환영하고, 실력 향상을 목표로 하는 분들 모집합니다.',
    category: '모집',
    date: '2024-01-15',
    viewCount: 45,
    commentCount: 8,
    showInProfile: false, // 기본값: 숨김
    likeCount: 17,
    enableHarvest: false, // 10일 안된 글(수확 불가)
  },
  {
    id: 2,
    title: '체스 전략 공유',
    content:
      '오늘 상대방과 체스 대결에서 사용한 전략을 공유합니다. 킹스 인디언 어택을 사용했는데, 상대방이 예상보다 잘 막아내서 고전했습니다.',
    category: '전략',
    date: '2024-01-14',
    viewCount: 32,
    commentCount: 12,
    showInProfile: false, // 기본값: 숨김
    likeCount: 8,
    enableHarvest: true, // 수확 가능
  },
  {
    id: 3,
    title: '배드민턴 코트 추천',
    content:
      '서울 강남 지역에서 배드민턴을 칠 수 있는 좋은 코트를 찾고 있습니다. 주차가 편하고, 시설이 깨끗한 곳을 추천해주세요.',
    category: '추천',
    date: '2024-01-13',
    viewCount: 28,
    commentCount: 15,
    showInProfile: false, // 기본값: 숨김
    likeCount: 23,
    enableHarvest: true, // 수확 가능
  },
  {
    id: 4,
    title: '당구 실력 향상 팁',
    content:
      '당구를 시작한 지 3개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 큐 각도 잡는 법과 파워 조절에 어려움을 겪고 있어요.',
    category: '질문',
    date: '2024-01-12',
    viewCount: 67,
    commentCount: 23,
    showInProfile: false, // 기본값: 숨김
    likeCount: 5,
    enableHarvest: null, // 수확 완료(어두운색)
  },
];

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState(initialMockPosts);
  const [loading, setLoading] = useState(true);
  const [harvestableTokens, setHarvestableTokens] = useState(0);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  useEffect(() => {
    // 실제로는 API 호출을 여기서 할 예정
    const fetchUserProfile = async () => {
      try {
        // API 호출 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUserProfile(mockUserProfile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleToggleVisibility = (postId: number, showInProfile: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, showInProfile } : post)),
    );

    // 실제로는 API 호출하여 서버에 저장
    console.log(`Post ${postId} visibility changed to: ${showInProfile}`);

    // 토큰 소각 처리 (showInProfile이 true일 때)
    if (showInProfile && userProfile) {
      setUserProfile((prev) => (prev ? { ...prev, tokens: (prev.tokens || 0) - 1 } : null));
      console.log('1 토큰이 소각되었습니다.');
    }
  };

  const handleHarvest = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, enableHarvest: null } : post)),
    );
    const post = posts.find((p) => p.id === postId);
    if (post && post.enableHarvest) {
      setHarvestableTokens((prev) => prev + post.likeCount);
    }
  };

  const handleHarvestAll = () => {
    // 실제로는 Web3 트랜잭션 처리
    if (harvestableTokens > 0 && userProfile) {
      setUserProfile((prev) =>
        prev ? { ...prev, tokens: (prev.tokens || 0) + harvestableTokens } : null,
      );
      setHarvestableTokens(0);
    }
  };

  const handleNicknameChange = () => {
    setIsNicknameModalOpen(true);
  };

  const handleNicknameSubmit = (newNickname: string) => {
    if (userProfile) {
      setUserProfile((prev) =>
        prev ? { ...prev, name: newNickname, tokens: (prev.tokens || 0) - 1 } : null,
      );
      console.log('닉네임이 변경되었습니다:', newNickname);
      console.log('1 토큰이 소각되었습니다.');
    }
  };

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
            프로필을 불러올 수 없습니다.
          </div>
        </Content>
        <BottomNavigation />
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '32px 16px 0 16px',
            flexWrap: 'wrap',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              minWidth: 180,
              maxWidth: 220,
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <ProfileHeader
              name={userProfile.name}
              profileImage={userProfile.profileImage}
              isMyProfile={true}
              onNicknameChange={handleNicknameChange}
            />
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 240,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              justifyContent: 'center',
            }}
          >
            <TokenDisplay
              tokens={userProfile.tokens ?? 0}
              harvestableTokens={harvestableTokens}
              onHarvestAll={handleHarvestAll}
              harvestButtonText="수확하기"
            />
          </div>
        </div>

        <div style={{ marginTop: 32, borderTop: '1px solid #eee', paddingTop: 24 }} />

        <GameStatsGrid gameStats={userProfile.gameStats} />

        <ProfilePostList
          posts={posts}
          isMyProfile={true}
          onToggleVisibility={handleToggleVisibility}
          onHarvest={handleHarvest}
        />
      </Content>

      <NicknameChangeModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        onSubmit={handleNicknameSubmit}
        currentNickname={userProfile.name}
        userTokens={userProfile.tokens ?? 0}
      />

      <BottomNavigation />
    </Container>
  );
}
