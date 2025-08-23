'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileHeader from '@/app/profile/components/ProfileHeader';
import TokenDisplay from '@/components/views/TokenDisplay';
import ProfilePostList from '@/app/profile/components/ProfilePostList';
import NicknameChangeModal from '@/components/modals/NicknameChangeModal';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import { useProfileApi, useMyPostsApi, MyPost } from '@/api/useUser';
import { useQueryClient } from '@tanstack/react-query';
import GameStatsGrid from '../components/GameStatsGrid';
import Image from 'next/image';
import { ICONS } from '@/assets';
import { useClaimAllAccumulatedTokens } from '@/api/usePrevContract';
import { useWepin } from '@/contexts/WepinContext';
import FullPageLoading from '@/components/layout/FullPageLoading';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.div`
  flex: 1;
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
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState<MyPost[]>([]);
  const [harvestableTokens, setHarvestableTokens] = useState(0);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  const claimAllAccumulatedTokens = useClaimAllAccumulatedTokens();

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

  const { executeContract } = useWepin();

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
    console.log('handleHarvest', userProfile.walletAddress, harvestableTokens);
    claimAllAccumulatedTokens.mutate(
      { address: userProfile.walletAddress },
      {
        onSuccess: async response => {
          console.log(response);
          const { parseUnits } = await import('ethers');
          const amount = parseUnits(response.data.amount, 18);

          await executeContract(
            'evmpolygon-amoy',
            response.data.contractAddress,
            response.data.contractABI,
            'claimWithSignature',
            [
              userProfile.walletAddress,
              amount,
              response.data.deadline,
              response.data.nonce,
              response.data.signature,
            ]
          );
          console.log('claimAllAccumulatedTokens success');

          // 수확 완료 후 프로필 데이터 리패치하여 밸런스 업데이트
          queryClient.refetchQueries({ queryKey: ['user-profile'] });
        },
        onError: () => {
          console.log('claimAllAccumulatedTokens error');
        },
      }
    );
    // 실제로는 Web3 트랜잭션 처리
    // if (harvestableTokens > 0 && userProfile.tokenAmount) {
    //   setTokenAmount((prev: string) => {
    //     const currentAmount = parseFloat(prev || '0');
    //     return (currentAmount + harvestableTokens).toFixed(8);
    //   });
    //   setHarvestableTokens(0);
    // }
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

  useEffect(() => {
    if (profileData) {
      setProfile(profileData.user); // 유저 프로필 정보 저장
      setUserElos(profileData.userElos); // ELO 정보 저장
    }
  }, [profileData, setProfile, setUserElos]);

  if (isLoading) return <FullPageLoading />;

  return (
    <Container>
      <Image
        src={ICONS.SETTING}
        alt="setting"
        width={24}
        height={24}
        style={{
          position: 'absolute',
          top: '16px',
          left: '20px',
          transition: 'transform 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'rotate(200deg)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'rotate(0deg)';
        }}
      />
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
