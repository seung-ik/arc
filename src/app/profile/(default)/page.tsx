'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ProfileHeader from '@/app/profile/components/ProfileHeader';
import TokenDisplay from '@/components/views/TokenDisplay';
import ProfilePostList from '@/app/profile/components/ProfilePostList';
import NicknameChangeModal from '@/components/modals/NicknameChangeModal';
import FirstPostGuideModal from '@/components/modals/GuideModal';
import { DEFAULT_NETWORK } from '@/constants/networks';
import { useAuthStore } from '@/stores/authStore';
import {
  useProfileApi,
  useMyPostsApi,
  MyPost,
  useUserTokensApi,
} from '@/api/useUser';
import GameStatsGrid from '../components/GameStatsGrid';
import {
  useClaimAllAccumulatedTokens,
  useClaimByLikeSignature,
} from '@/api/usePrevContract';
import { useWepin } from '@/contexts/WepinContext';
import FullPageLoading from '@/components/layout/FullPageLoading';
import { useModal } from '@/hooks/useModal';

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
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [harvestableTokens, setHarvestableTokens] = useState(0);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const firstPostGuideModal = useModal();

  const claimAllAccumulatedTokens = useClaimAllAccumulatedTokens();
  const claimByLikeSignature = useClaimByLikeSignature();

  const { data: profileData, isLoading } = useProfileApi();
  const {
    setProfile,
    setUserElos,
    setTokenAmount,
    setAvailableToken,
    setNickname,
    userProfile,
    userElos,
  } = useAuthStore();

  const { data: myPostsData } = useMyPostsApi();
  const { refetch: refetchUserTokens } = useUserTokensApi(userProfile?.id || 0);
  const { executeContract } = useWepin();

  const handleHarvest = (postId: number) => {
    // useClaimByLikeSignature API 호출
    claimByLikeSignature.mutate(
      {
        postId: postId,
        userAddress: userProfile.walletAddress,
      },
      {
        onSuccess: async response => {
          console.log('Claim by like signature response:', response);

          try {
            const { parseUnits } = await import('ethers');
            const amount = parseUnits(response.data.amount, 18);
            setTxLoading(true); // 트랜잭션 시작 시 로딩 상태 활성화

            const tx = await executeContract(
              DEFAULT_NETWORK,
              response.data.contractAddress,
              response.data.contractABI,
              'claimWithSignature',
              [
                response.data.postId,
                response.data.to,
                amount.toString(),
                response.data.deadline,
                response.data.nonce,
                response.data.signature,
              ]
            );
            console.log('Individual harvest contract success:', tx);

            // 옵티미스틱 업데이트: 즉시 토큰 증가
            if (userProfile.tokenAmount) {
              const currentAmount = parseFloat(userProfile.tokenAmount);
              const claimAmount = parseFloat(response.data.amount);
              const newAmount = (currentAmount + claimAmount).toFixed(8);
              setTokenAmount(newAmount);
              console.log('Optimistic update for individual harvest:', {
                currentAmount,
                claimAmount,
                newAmount,
              });
            }
            setTxLoading(false); // 트랜잭션 완료 시 로딩 상태 비활성화
          } catch (error: any) {
            console.dir(error);
            // alert(error.shortMessage); TODO: 임시
            setTxLoading(false); // 에러 시 로딩 상태 비활성화
            return;
          }

          // 10초 후 실제 값으로 교체
          setTimeout(async () => {
            if (userProfile?.id) {
              try {
                const result = await refetchUserTokens();

                if (result.data?.data?.totalTokens) {
                  const actualAmount = result.data.data.totalTokens;
                  const availableAmount = result.data.data.availableTokens;
                  setTokenAmount(actualAmount);
                  setAvailableToken(availableAmount);
                }
              } catch (err: any) {
                console.dir(err);
                alert(err.shortMessage);
              }
            }
          }, 10000);
        },
        onError: err => {
          console.dir(err);
          alert('수확 가능한 토큰이 없습니다.');
          setTxLoading(false); // 에러 시 로딩 상태 비활성화
        },
      }
    );
  };

  const handleHarvestAll = () => {
    claimAllAccumulatedTokens.mutate(
      { address: userProfile.walletAddress },
      {
        onSuccess: async response => {
          console.log(response);
          const { parseUnits } = await import('ethers');
          const amount = parseUnits(response.data.amount, 18);
          try {
            setTxLoading(true); // 트랜잭션 시작 시 로딩 상태 활성화

            const tx = await executeContract(
              DEFAULT_NETWORK,
              response.data.contractAddress,
              response.data.contractABI,
              'claimWithSignature',
              [
                response.data.to,
                amount,
                response.data.deadline,
                response.data.nonce,
                response.data.signature,
              ]
            );
            console.log('success tx', tx);

            // 옵티미스틱 업데이트: 즉시 토큰 증가
            if (userProfile.tokenAmount) {
              const currentAmount = parseFloat(userProfile.tokenAmount);
              const newAmount =
                currentAmount + (Number(profileData?.user.availableToken) || 0);

              setTokenAmount(String(newAmount));
              setAvailableToken('0'); // availableToken을 0으로 리셋
              setHarvestableTokens(0); // 수확 가능한 토큰 리셋
              console.log('Optimistic update:', {
                currentAmount,
                harvestableTokens,
                newAmount,
              });
            }
            setTxLoading(false); // 트랜잭션 완료 시 로딩 상태 비활성화
          } catch (error: any) {
            console.dir(error);
            // alert(error.shortMessage); TODO: 임시
            setTxLoading(false); // 에러 시 로딩 상태 비활성화
            return;
          }

          // 10초 후 실제 값으로 교체
          setTimeout(async () => {
            if (userProfile?.id) {
              try {
                const result = await refetchUserTokens();
                if (result.data?.data?.totalTokens) {
                  const actualAmount = result.data.data.totalTokens;
                  const availableAmount = result.data.data.availableTokens;
                  setTokenAmount(actualAmount);
                  setAvailableToken(availableAmount);
                  console.log('Replaced with actual value:', actualAmount);
                }
              } catch (error: any) {
                console.dir(error);
                // alert(error.shortMessage); TODO: 임시
              }
            }
          }, 10000);
        },
        onError: () => {
          setTxLoading(false); // 에러 시 로딩 상태 비활성화
        },
      }
    );
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

  // 내가 쓴 글 목록 콘솔 출력 및 상태 업데이트
  useEffect(() => {
    if (myPostsData) {
      setPosts(myPostsData.data);
    }
  }, [myPostsData]);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData.user); // 유저 프로필 정보 저장
      setUserElos(profileData.userElos); // ELO 정보 저장
    }
  }, [profileData, setProfile, setUserElos]);

  // 첫 글 작성 가이드 모달 표시 여부 확인
  useEffect(() => {
    if (myPostsData?.data?.length === 0 && !isLoading) {
      const today = new Date().toDateString();
      const hiddenDate = localStorage.getItem('firstPostGuideModal');

      // hiddenDate가 없거나 오늘이 아닌 경우에만 모달 표시
      if (!hiddenDate || hiddenDate !== today) {
        firstPostGuideModal.openModal();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPostsData, isLoading]);

  if (isLoading) return <FullPageLoading />;

  return (
    <>
      {txLoading && <FullPageLoading message="트랜잭션 진행중..." />}
      <Container>
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

        <FirstPostGuideModal
          isOpen={firstPostGuideModal.isOpen}
          onClose={firstPostGuideModal.closeModal}
          title="첫 글을 작성해보세요!"
          description="커뮤니티에 글을 작성하면 EXP를 받을 수 있어요."
          rewardText="첫 글 작성 시"
          rewardAmount="3 EXP"
          localStorageKey="firstPostGuideModal"
        />
      </Container>
    </>
  );
}

{
  /* <Image
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
      /> */
}
