'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ProfileHeader from '@/components/ProfileHeader';
import TokenDisplay from '@/components/TokenDisplay';
import GameStatsGrid from '@/components/GameStatsGrid';
import ProfilePostList from '@/components/ProfilePostList';
import { ProfilePost } from '@/types/post';
import NicknameChangeModal from '@/components/NicknameChangeModal';
import { UserProfile, GAME_TYPES } from '@/constants/gameTypes';
import { ROUTES } from '@/constants/routes';
import FullPageLoading from '@/components/FullPageLoading';
import { useLogoutAll } from '@/hooks/useLogoutAll';
import { useAuthStore } from '@/stores/authStore';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.div`
  flex: 1;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  left: ${props => props.theme.spacing.md};
  background-color: white;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 4px 8px;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.error};
    color: white;
  }
`;

const ProfileTopWrapper = styled.div`
  display: flex;
  gap: 32px;
  align-items: flex-end;
  justify-content: center;
  padding: 32px 16px 24px 16px;
  flex-wrap: wrap;
  max-width: 600px;
  margin: 0 auto;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
`;

const ProfileLeftCol = styled.div`
  min-width: 180px;
  max-width: 220px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ProfileRightCol = styled.div`
  flex: 1;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
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
  // 일반 포스트
  {
    id: 1,
    title: '배드민턴 스매시 기술 공유',
    content:
      '배드민턴 스매시를 연마한 지 2년이 되었는데, 정말 효과적인 연습법을 발견했습니다. 특히 백핸드 스매시에서 파워와 정확도를 동시에 높이는 방법을 공유합니다.',
    authorId: 'user1',
    authorName: '김철수',
    postType: '일반',
    category: '배드민턴',
    date: '2024-01-10',
    viewCount: 234,
    commentCount: 45,
    likeCount: 12,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
    showInProfile: true,
    enableHarvest: true,
    harvestStage: 1, // 1단계 수확 (노란색)
  },
  {
    id: 2,
    title: '탁구 대회 우승 후기',
    content:
      '지난 주에 열린 지역 탁구 대회에서 우승했습니다! 3년간의 연습이 결실을 맺은 것 같아서 정말 기쁩니다. 특히 결승전에서 상대방의 강력한 스핀 서브를 어떻게 받아냈는지 자세히 설명합니다.',
    authorId: 'user1',
    authorName: '김철수',
    postType: '일반',
    category: '탁구',
    date: '2024-01-08',
    viewCount: 567,
    commentCount: 89,
    likeCount: 156,
    dislikeCount: 2,
    isLiked: true,
    isDisliked: false,
    showInProfile: true,
    enableHarvest: true,
    harvestStage: 3, // 3단계 수확 (파란색)
  },
  {
    id: 3,
    title: '체스 오프닝 가이드',
    content:
      '체스 초보자를 위한 기본 오프닝들을 정리했습니다. 이탈리안 게임, 루이 로페즈, 스코치 게임 등 자주 사용되는 오프닝들을 단계별로 설명합니다.',
    authorId: 'user1',
    authorName: '김철수',
    postType: '일반',
    category: '체스',
    date: '2024-01-05',
    viewCount: 445,
    commentCount: 67,
    likeCount: 78,
    dislikeCount: 1,
    isLiked: false,
    isDisliked: false,
    showInProfile: true,
    enableHarvest: true,
    harvestStage: 2, // 2단계 수확 (초록색)
  },
  // 매치 포스트
  {
    id: 4,
    title: '배드민턴 매치 상대 구합니다',
    content:
      '서울 강남 지역에서 배드민턴 매치 상대를 구합니다. 실력은 중급 정도이고, 매주 토요일 오후에 치고 싶습니다. 연락처 남겨주세요!',
    authorId: 'user1',
    authorName: '김철수',
    postType: '매치',
    category: '배드민턴',
    date: '2023-12-28',
    viewCount: 156,
    commentCount: 23,
    likeCount: 18,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
    showInProfile: true,
    enableHarvest: true,
    harvestStage: 2, // 2단계 수확 (초록색)
  },
  {
    id: 5,
    title: '체스 친선 대국 상대',
    content:
      '부산 해운대 지역에서 체스 친선 대국 상대를 구합니다. 실력에 관계없이 즐겁게 두실 분 환영합니다!',
    authorId: 'user1',
    authorName: '김철수',
    postType: '매치',
    category: '체스',
    date: '2023-12-25',
    viewCount: 98,
    commentCount: 15,
    likeCount: 12,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
    showInProfile: false,
    enableHarvest: false,
  },
  // 멘토 포스트
  {
    id: 6,
    title: '탁구 레슨 제공합니다',
    content:
      '탁구 레슨을 제공합니다. 8년 경력의 탁구 지도자입니다. 초급부터 중급까지 체계적으로 가르쳐드립니다. 서울 강남 지역에서 가능합니다.',
    authorId: 'user1',
    authorName: '김철수',
    postType: '멘토',
    category: '탁구',
    date: '2023-12-20',
    viewCount: 276,
    commentCount: 38,
    likeCount: 67,
    dislikeCount: 1,
    isLiked: true,
    isDisliked: false,
    showInProfile: true,
    enableHarvest: true,
    harvestStage: 2, // 2단계 수확 (초록색)
  },
  {
    id: 7,
    title: '바둑 기초 레슨',
    content:
      '바둑 기초를 가르쳐드립니다. 기본 규칙, 포석, 중반전 전략부터 차근차근 배워보세요. 대구 중구 지역에서 가능합니다.',
    authorId: 'user1',
    authorName: '김철수',
    postType: '멘토',
    category: '바둑',
    date: '2023-12-15',
    viewCount: 223,
    commentCount: 39,
    likeCount: 29,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
    showInProfile: false,
    enableHarvest: false,
  },
];
export default function ProfilePage() {
  const router = useRouter();
  const logoutAll = useLogoutAll();
  // const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState(mockMyPosts);
  const [loading, setLoading] = useState(true);
  const [harvestableTokens, setHarvestableTokens] = useState(0);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  const user = useAuthStore();

  console.log(user);

  useEffect(() => {
    // 실제로는 API 호출을 여기서 할 예정
    const fetchUserProfile = async () => {
      try {
        // API 호출 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500));
        setUserProfile(mockUserProfile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleHarvest = (postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, enableHarvest: false } : post
      )
    );
    const post = posts.find(p => p.id === postId);
    if (post && post.enableHarvest) {
      const likeCount = post.likeCount ?? 0;
      setHarvestableTokens(prev => prev + likeCount);
    }
  };

  const handleHarvestAll = () => {
    // 실제로는 Web3 트랜잭션 처리
    if (harvestableTokens > 0 && userProfile) {
      setUserProfile(prev =>
        prev
          ? { ...prev, tokens: (prev.tokens || 0) + harvestableTokens }
          : null
      );
      setHarvestableTokens(0);
    }
  };

  const handleNicknameChange = () => {
    setIsNicknameModalOpen(true);
  };

  const handleNicknameSubmit = (newNickname: string) => {
    if (userProfile) {
      setUserProfile(prev =>
        prev
          ? { ...prev, name: newNickname, tokens: (prev.tokens || 0) - 1 }
          : null
      );
      console.log('닉네임이 변경되었습니다:', newNickname);
      console.log('1 토큰이 소각되었습니다.');
    }
  };

  const handleViewTokenHistory = () => {
    router.push(ROUTES.profile.tokenHistory);
  };

  const handleLogout = async () => {
    await logoutAll();
  };

  if (loading || !userProfile) {
    return <FullPageLoading />;
  }

  return (
    <Container>
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      <Content>
        <ProfileTopWrapper>
          <ProfileLeftCol>
            <ProfileHeader
              name={user.nickname}
              profileImage={user.profileImageUrl}
              isMyProfile={true}
              onNicknameChange={handleNicknameChange}
            />
          </ProfileLeftCol>
          <ProfileRightCol>
            <TokenDisplay
              tokens={Number(user.tokenAmount) ?? 0}
              harvestableTokens={Number(user.availableToken) ?? 0}
              onHarvestAll={handleHarvestAll}
              harvestButtonText="수확하기"
              onViewHistory={handleViewTokenHistory}
            />
          </ProfileRightCol>
        </ProfileTopWrapper>

        <GameStatsGrid gameStats={userProfile.gameStats} />

        <ProfilePostList
          posts={posts}
          isMyProfile={true}
          onHarvest={handleHarvest}
        />
      </Content>

      <NicknameChangeModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        onSubmit={handleNicknameSubmit}
        currentNickname={user.nickname}
        userTokens={Number(user.tokenAmount) ?? 0}
      />
    </Container>
  );
}
