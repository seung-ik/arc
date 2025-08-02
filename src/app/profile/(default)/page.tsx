'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ProfileHeader from '@/components/ProfileHeader';
import TokenDisplay from '@/components/TokenDisplay';
import GameStatsGrid from '@/components/GameStatsGrid';
import ProfilePostList from '@/components/ProfilePostList';
import NicknameChangeModal from '@/components/NicknameChangeModal';
import { ROUTES } from '@/constants/routes';
import FullPageLoading from '@/components/FullPageLoading';
import { useLogoutAll } from '@/hooks/useLogoutAll';
import { useAuthStore } from '@/stores/authStore';
import { useProfileApi, useMyPostsApi, MyPost } from '@/api/useUser';

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

export default function ProfilePage() {
  const router = useRouter();
  const logoutAll = useLogoutAll();

  const [posts, setPosts] = useState<MyPost[]>([]);
  const [harvestableTokens, setHarvestableTokens] = useState(0);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  const { data: profileData, isLoading } = useProfileApi();
  const {
    setProfile,
    setUserElos,
    setTokenAmount,
    setNickname,
    userProfile,
    userElos,
  } = useAuthStore();
  const { data: myPostsData } = useMyPostsApi();

  // 내가 쓴 글 목록 콘솔 출력 및 상태 업데이트
  useEffect(() => {
    if (myPostsData) {
      console.log('내가 쓴 글 목록:', myPostsData);
      setPosts(myPostsData.data);
    }
  }, [myPostsData]);

  const handleHarvest = (postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post => (post.id === postId ? { ...post } : post))
    );
    const post = posts.find(p => p.id === postId);
    if (post) {
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

        <GameStatsGrid userElos={userElos} />

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
