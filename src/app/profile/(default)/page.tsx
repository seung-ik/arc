'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';

import ProfileHeader from '@/components/ProfileHeader';
import TokenDisplay from '@/components/TokenDisplay';
import GameStatsGrid from '@/components/GameStatsGrid';
import ProfilePostList, { ProfilePost } from '@/components/ProfilePostList';
import NicknameChangeModal from '@/components/NicknameChangeModal';
import { UserProfile, GAME_TYPES } from '@/constants/gameTypes';
import { ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { useWepin } from '@/contexts/WepinContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
`;

const Content = styled.div`
  flex: 1;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: ${(props) => props.theme.spacing.md};
  left: ${(props) => props.theme.spacing.md};
  background-color: white;
  color: ${(props) => props.theme.colors.error};
  border: 1px solid ${(props) => props.theme.colors.error};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  padding: 4px 8px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.error};
    color: white;
  }
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
const mockMyPosts: ProfilePost[] = [
  {
    id: 1,
    title: '배드민턴 스매시 기술 공유',
    content:
      '배드민턴 스매시를 연마한 지 2년이 되었는데, 정말 효과적인 연습법을 발견했습니다. 특히 백핸드 스매시에서 파워와 정확도를 동시에 높이는 방법을 공유합니다.',
    category: '팁',
    date: '2024-01-10',
    viewCount: 234,
    commentCount: 45,
    showInProfile: true,
    likeCount: 12,
    enableHarvest: true,
    harvestStage: 1, // 1단계 수확 (노란색)
  },
  {
    id: 2,
    title: '탁구 대회 우승 후기',
    content:
      '지난 주에 열린 지역 탁구 대회에서 우승했습니다! 3년간의 연습이 결실을 맺은 것 같아서 정말 기쁩니다. 특히 결승전에서 상대방의 강력한 스핀 서브를 어떻게 받아냈는지 자세히 설명합니다.',
    category: '후기',
    date: '2024-01-08',
    viewCount: 567,
    commentCount: 89,
    showInProfile: true,
    likeCount: 156,
    enableHarvest: true,
    harvestStage: 3, // 3단계 수확 (파란색)
  },
  {
    id: 3,
    title: '체스 오프닝 가이드',
    content:
      '체스 초보자를 위한 기본 오프닝들을 정리했습니다. 이탈리안 게임, 루이 로페즈, 스코치 게임 등 자주 사용되는 오프닝들을 단계별로 설명합니다.',
    category: '가이드',
    date: '2024-01-05',
    viewCount: 445,
    commentCount: 67,
    showInProfile: true,
    likeCount: 78,
    enableHarvest: true,
    harvestStage: 2, // 2단계 수확 (초록색)
  },
  {
    id: 4,
    title: '바둑 입문 가이드',
    content:
      '바둑을 처음 배우는 분들을 위한 입문 가이드입니다. 기본 규칙부터 시작해서 간단한 전략까지 단계별로 설명합니다.',
    category: '가이드',
    date: '2024-01-03',
    viewCount: 312,
    commentCount: 42,
    showInProfile: true,
    likeCount: 45,
    enableHarvest: true,
    harvestStage: 1, // 1단계 수확 (노란색)
  },
  {
    id: 5,
    title: '테니스 서브 연습법',
    content:
      '테니스 서브를 연습하는 방법을 정리했습니다. 특히 스핀 서브와 플랫 서브의 차이점과 각각의 장단점을 설명합니다.',
    category: '팁',
    date: '2024-01-01',
    viewCount: 189,
    commentCount: 28,
    showInProfile: false,
    likeCount: 23,
    enableHarvest: false,
  },
  {
    id: 6,
    title: '당구 큐 관리법',
    content:
      '당구 큐를 오래 사용하기 위한 관리법을 정리했습니다. 습도 관리, 클리닝, 보관 방법 등 큐 수명을 연장시키는 방법들을 소개합니다.',
    category: '가이드',
    date: '2023-12-28',
    viewCount: 198,
    commentCount: 31,
    showInProfile: true,
    likeCount: 51,
    enableHarvest: true,
    harvestStage: 2, // 2단계 수확 (초록색)
  },
  {
    id: 7,
    title: '배드민턴 동호회 모집',
    content:
      '서울 강남 지역에서 배드민턴을 치는 동호회를 만들려고 합니다. 초급부터 중급까지 환영하며, 매주 토요일 오후에 활동합니다.',
    category: '모집',
    date: '2023-12-25',
    viewCount: 156,
    commentCount: 23,
    showInProfile: false,
    likeCount: 18,
    enableHarvest: false,
  },
  {
    id: 8,
    title: '체스 엔드게임 전략',
    content:
      '체스 엔드게임에서 승리를 확실히 하는 전략들을 정리했습니다. 킹과 폰만 남은 상황에서의 승리법을 중심으로 설명합니다.',
    category: '전략',
    date: '2023-12-20',
    viewCount: 276,
    commentCount: 38,
    showInProfile: true,
    likeCount: 67,
    enableHarvest: true,
    harvestStage: 2, // 2단계 수확 (초록색)
  },
  {
    id: 9,
    title: '탁구 라켓 고르는 법',
    content:
      '탁구 라켓을 고를 때 고려해야 할 요소들을 정리했습니다. 라켓의 무게, 두께, 스핀 성능 등을 종합적으로 평가하는 방법을 설명합니다.',
    category: '가이드',
    date: '2023-12-15',
    viewCount: 223,
    commentCount: 39,
    showInProfile: false,
    likeCount: 29,
    enableHarvest: false,
  },
  {
    id: 10,
    title: '바둑 기보 분석 - 프로 기사 대국',
    content:
      '최근 프로 기사들의 대국을 분석해보았습니다. 특히 중반전에서의 판단과 수순이 인상적이었습니다. 바둑을 배우는 분들에게 도움이 될 것 같습니다.',
    category: '분석',
    date: '2023-12-10',
    viewCount: 345,
    commentCount: 56,
    showInProfile: true,
    likeCount: 234,
    enableHarvest: true,
    harvestStage: 4, // 4단계 수확 (보라색)
  },
  {
    id: 11,
    title: '테니스 라켓 구매 후기',
    content:
      'Wilson Pro Staff RF97을 구매했습니다. 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다.',
    category: '후기',
    date: '2023-12-05',
    viewCount: 89,
    commentCount: 31,
    showInProfile: true,
    likeCount: 15,
    enableHarvest: true,
    harvestStage: 1, // 1단계 수확 (노란색)
  },
  {
    id: 12,
    title: '바둑 기보 분석',
    content:
      '오늘 프로 기사와의 대국에서 배운 수를 분석해보았습니다. 특히 중반전에서의 포석이 인상적이었어요.',
    category: '분석',
    date: '2023-12-01',
    viewCount: 56,
    commentCount: 18,
    showInProfile: true,
    likeCount: 8,
    enableHarvest: false, // 좋아요 부족으로 수확 불가
  },
];
export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useWepin();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState(mockMyPosts);
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
      const likeCount = post.likeCount ?? 0;
      setHarvestableTokens((prev) => prev + likeCount);
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

  const handleViewTokenHistory = () => {
    router.push(ROUTES.profile.tokenHistory);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push(ROUTES.auth.login);
    } catch (error) {
      console.error('Logout failed:', error);
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
      </Container>
    );
  }

  return (
    <Container>
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
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
              onViewHistory={handleViewTokenHistory}
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
    </Container>
  );
}
