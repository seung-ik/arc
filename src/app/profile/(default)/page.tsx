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
import { ROUTES } from '@/constants/routes';
import FullPageLoading from '@/components/FullPageLoading';
import { useLogoutAll } from '@/hooks/useLogoutAll';
import { useAuthStore } from '@/stores/authStore';
import { useProfileApi } from '@/api/useUser';

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

// 임시 글 데이터 (기본값: 숨김)
const mockMyPosts: ProfilePost[] = [
  // 일반 포스트
  {
    id: 1,
    title: '배드민턴 스매시 기술 공유',
    content:
      '배드민턴 스매시를 연마한 지 2년이 되었는데, 정말 효과적인 연습법을 발견했습니다. 특히 백핸드 스매시에서 파워와 정확도를 동시에 높이는 방법을 공유합니다.',
    author: {
      id: 1,
      nickname: '김철수',
      profileImageUrl: null,
    },
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    isHidden: false,
    viewCount: 234,
    commentCount: 45,
    sportCategoryId: 1,
    sportCategoryName: '배드민턴',
    showInProfile: true,
    enableHarvest: true,
    harvestStage: 1, // 1단계 수확 (노란색)
  },
  {
    id: 2,
    title: '탁구 대회 우승 후기',
    content:
      '지난 주에 열린 지역 탁구 대회에서 우승했습니다! 3년간의 연습이 결실을 맺은 것 같아서 정말 기쁩니다. 특히 결승전에서 상대방의 강력한 스핀 서브를 어떻게 받아냈는지 자세히 설명합니다.',
    author: {
      id: 1,
      nickname: '김철수',
      profileImageUrl: null,
    },
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
    isHidden: false,
    viewCount: 567,
    commentCount: 89,
    sportCategoryId: 1,
    sportCategoryName: '탁구',
    showInProfile: true,
    enableHarvest: true,
    harvestStage: 3, // 3단계 수확 (파란색)
  },
  {
    id: 3,
    title: '체스 오프닝 가이드',
    content:
      '체스 초보자를 위한 기본 오프닝들을 정리했습니다. 이탈리안 게임, 루이 로페즈, 스코치 게임 등 자주 사용되는 오프닝들을 단계별로 설명합니다.',
    author: {
      id: 1,
      nickname: '김철수',
      profileImageUrl: null,
    },
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
    isHidden: false,
    viewCount: 445,
    commentCount: 67,
    sportCategoryId: 1,
    sportCategoryName: '체스',
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
    author: {
      id: 1,
      nickname: '김철수',
      profileImageUrl: null,
    },
    createdAt: '2023-12-28',
    updatedAt: '2023-12-28',
    isHidden: false,
    viewCount: 156,
    commentCount: 23,
    sportCategoryId: 1,
    sportCategoryName: '배드민턴',
    showInProfile: true,
    enableHarvest: true,
    harvestStage: 2, // 2단계 수확 (초록색)
  },
  {
    id: 5,
    title: '체스 친선 대국 상대',
    content:
      '부산 해운대 지역에서 체스 친선 대국 상대를 구합니다. 실력에 관계없이 즐겁게 두실 분 환영합니다!',
    author: {
      id: 1,
      nickname: '김철수',
      profileImageUrl: null,
    },
    createdAt: '2023-12-25',
    updatedAt: '2023-12-25',
    isHidden: false,
    viewCount: 98,
    commentCount: 15,
    sportCategoryId: 1,
    sportCategoryName: '체스',
    showInProfile: false,
    enableHarvest: false,
  },
  // 멘토 포스트
  {
    id: 6,
    title: '탁구 레슨 제공합니다',
    content:
      '탁구 레슨을 제공합니다. 8년 경력의 탁구 지도자입니다. 초급부터 중급까지 체계적으로 가르쳐드립니다. 서울 강남 지역에서 가능합니다.',
    author: {
      id: 1,
      nickname: '김철수',
      profileImageUrl: null,
    },
    createdAt: '2023-12-20',
    updatedAt: '2023-12-20',
    isHidden: false,
    viewCount: 276,
    commentCount: 38,
    sportCategoryId: 1,
    sportCategoryName: '탁구',
    showInProfile: true,
    enableHarvest: true,
    harvestStage: 2, // 2단계 수확 (초록색)
  },
];
export default function ProfilePage() {
  const router = useRouter();
  const logoutAll = useLogoutAll();

  const [posts, setPosts] = useState(mockMyPosts);
  const [harvestableTokens, setHarvestableTokens] = useState(0);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  const { data: profileData, isLoading } = useProfileApi();
  const { setProfile, setUserElos, setTokenAmount, setNickname, userProfile } =
    useAuthStore();

  const handleHarvest = (postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, enableHarvest: false } : post
      )
    );
    const post = posts.find(p => p.id === postId);
    if (post && post.enableHarvest) {
      const likeCount = post.commentCount ?? 0; // 좋아요개수로 바꿔야됨
      setHarvestableTokens(prev => prev + likeCount);
    }
  };

  const handleHarvestAll = () => {
    // 실제로는 Web3 트랜잭션 처리
    if (harvestableTokens > 0 && userProfile.tokenAmount) {
      setTokenAmount((prev: string) => {
        const currentAmount = parseFloat(prev || '0');
        return (currentAmount + harvestableTokens).toFixed(8);
      });
      setHarvestableTokens(0);
    }
  };

  const handleNicknameChange = () => {
    setIsNicknameModalOpen(true);
  };

  const handleNicknameSubmit = (newNickname: string) => {
    if (userProfile.tokenAmount) {
      setTokenAmount((prev: string) => {
        const currentAmount = parseFloat(prev || '0');
        return (currentAmount - 1).toFixed(8);
      });
      setNickname(newNickname);
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

  useEffect(() => {
    if (profileData) {
      setProfile(profileData.user); // 유저 프로필 정보 저장
      setUserElos(profileData.userElos); // ELO 정보 저장
    }
  }, [profileData, setProfile, setUserElos]);

  if (isLoading) {
    return <FullPageLoading />;
  }

  return (
    <Container>
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      <Content>
        <ProfileTopWrapper>
          <ProfileLeftCol>
            <ProfileHeader
              name={userProfile.nickname || ''}
              profileImage={userProfile.profileImageUrl || undefined}
              isMyProfile={true}
              onNicknameChange={handleNicknameChange}
            />
          </ProfileLeftCol>
          <ProfileRightCol>
            <TokenDisplay
              tokens={Number(userProfile.tokenAmount) ?? 0}
              harvestableTokens={Number(userProfile.availableToken) ?? 0}
              onHarvestAll={handleHarvestAll}
              harvestButtonText="수확하기"
              onViewHistory={handleViewTokenHistory}
            />
          </ProfileRightCol>
        </ProfileTopWrapper>

        <GameStatsGrid />

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
        currentNickname={userProfile.nickname || ''}
        userTokens={Number(userProfile.tokenAmount) ?? 0}
      />
    </Container>
  );
}
