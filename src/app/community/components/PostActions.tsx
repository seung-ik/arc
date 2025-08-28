'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useWepin } from '@/contexts/WepinContext';
import { useHatePostMutation } from '@/api/useReaction';
import { useLikeSignatureData } from '@/api/usePrevContract';
import { GeneralPostData } from '@/types/post';
import Image from 'next/image';
import { ICONS } from '@/assets';
import { DEFAULT_NETWORK } from '@/constants/networks';
import { useAuthStore } from '@/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { useUserTokensApi } from '@/api/useUser';
import FullPageLoading from '@/components/layout/FullPageLoading';

const PostActionsContainer = styled.div`
  margin: ${props => props.theme.spacing.md} 0;
  padding: ${props => props.theme.spacing.md} 0;
  margin-bottom: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
`;

const ActionButton = styled.button<{
  $isActive: boolean;
  $variant: 'like' | 'dislike';
}>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props =>
    props.$isActive
      ? props.theme.colors.secondaryLight
      : props.theme.colors.background};
  color: ${props =>
    props.$isActive
      ? props.theme.colors.textBlack
      : props.theme.colors.textBlack};
  cursor: pointer;
  transition: all 0.2s;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};

  &:hover {
    background-color: ${props => props.theme.colors.secondaryLight};
    color: ${props => props.theme.colors.textBlack};
  }
`;

const ButtonCount = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  opacity: 0.8;
`;

interface PostActionsProps {
  post: GeneralPostData;
}

export default function PostActions({ post }: PostActionsProps) {
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount || 0);
  const [localHateCount, setLocalHateCount] = useState(post.hateCount || 0);
  const [localIsLiked, setLocalIsLiked] = useState(post.isLiked || false);
  const [localIsHated, setLocalIsHated] = useState(post.isHated || false);
  const [txLoading, setTxLoading] = useState(false);

  const hatePostMutation = useHatePostMutation();
  const likeSignatureData = useLikeSignatureData();
  const queryClient = useQueryClient();
  const { userProfile, setTokenAmount, setAvailableToken } = useAuthStore();
  const { refetch: refetchUserTokens } = useUserTokensApi(userProfile?.id || 0);

  const { executeContract } = useWepin();

  const handleLike = async () => {
    if (Number(userProfile.tokenAmount) < 1) {
      alert('토큰이 부족합니다.');
      return;
    }

    // 1. 컨트랙트 콜 전 필요한 데이터 받아오기
    likeSignatureData.mutate(
      { postId: post.id },
      {
        onSuccess: async response => {
          console.log('컨트랙트 콜을 위한 데이터:', response);
          if (!response.success) {
            alert(response.error?.message || '오류가 발생했습니다.');
            setTxLoading(false); // 에러 시 로딩 상태 비활성화
            return;
          }

          try {
            // 1 토큰을 wei 단위로 변환
            const { parseUnits } = await import('ethers');
            const amount = parseUnits('1', 18);
            setTxLoading(true); // 트랜잭션 시작 시 로딩 상태 활성화

            const tx = await executeContract(
              DEFAULT_NETWORK,
              response.data.contractAddress,
              response.data.contractABI,
              'transferAndCall(address,uint256,bytes)',
              [response.data.to, amount.toString(), response.data.encodedData]
            );

            console.log('like tx', tx);

            // 옵티미스틱 업데이트: 즉시 토큰 감소, 좋아요 처리
            console.log('optimistic update start');
            setLocalLikeCount(prev => prev + 1);
            setLocalIsLiked(true);
            const currentAmount = parseFloat(userProfile.tokenAmount);
            const newAmount = (currentAmount - 1).toFixed(8);
            setTokenAmount(newAmount);
            console.log('newAmount', newAmount);
            console.log('optimistic update end');

            setTxLoading(false); // 트랜잭션 완료 시 로딩 상태 비활성화
          } catch (error: any) {
            console.dir(error);
            alert(error.shortMessage);
            setTxLoading(false); // 에러 시 로딩 상태 비활성화
            return;
          }

          // 현재 글의 상세 정보를 다시 가져오기
          // 글 목록도 함께 업데이트
          queryClient.invalidateQueries({
            queryKey: ['post-detail', post.id],
          });
          queryClient.invalidateQueries({
            queryKey: ['posts'],
          });

          // 10초뒤에 현재 글 다시 리패치
          setTimeout(async () => {
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
              alert(error.shortMessage);
            }
          }, 10000);
        },
        onError: () => {
          setTxLoading(false); // 에러 시 로딩 상태 비활성화
        },
      }
    );
  };

  const handleDislike = () => {
    hatePostMutation.mutate(post.id, {
      onSuccess: data => {
        setLocalHateCount(data.data.hateCount);
        setLocalIsHated(data.data.isHated);
        // 좋아요가 활성화되어 있다면 비활성화
        if (data.data.isHated && localIsLiked) {
          setLocalIsLiked(false);
          setLocalLikeCount(prev => Math.max(0, prev - 1));
        }
      },
    });
  };

  return (
    <>
      {txLoading && <FullPageLoading message={'트랜잭션 처리 중...'} />}
      <PostActionsContainer>
        <ActionButtons>
          <ActionButton
            onClick={handleLike}
            $isActive={localIsLiked}
            $variant="like"
          >
            <Image src={ICONS.GOOD} alt="좋아요" />
            <ButtonCount>{localLikeCount}</ButtonCount>
          </ActionButton>
          <ActionButton
            onClick={handleDislike}
            $isActive={localIsHated}
            $variant="dislike"
          >
            <Image src={ICONS.HATE} alt="싫어요" />
            <ButtonCount>{localHateCount}</ButtonCount>
          </ActionButton>
        </ActionButtons>
      </PostActionsContainer>
    </>
  );
}
