'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useWepin } from '@/contexts/WepinContext';
import { useLikePostMutation, useHatePostMutation } from '@/api/useReaction';
import { useLikeSignatureData } from '@/api/usePrevContract';
import { GeneralPostData } from '@/types/post';
import Image from 'next/image';
import { ICONS } from '@/assets';

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

  const likePostMutation = useLikePostMutation();
  const hatePostMutation = useHatePostMutation();
  const likeSignatureData = useLikeSignatureData();

  const { executeContract } = useWepin();

  const handleLike = async () => {
    // 1. 컨트랙트 콜 전 필요한 데이터 받아오기
    likeSignatureData.mutate(
      { postId: post.id },
      {
        onSuccess: async response => {
          console.log('컨트랙트 콜을 위한 데이터:', response);

          try {
            // 1 토큰을 wei 단위로 변환
            const { parseUnits } = await import('ethers');
            const amount = parseUnits('1', 18);
            const tx = await executeContract(
              'evmpolygon-amoy',
              response.data.contractAddress,
              response.data.contractABI,
              'transferAndCall(address,uint256,bytes)',
              [response.data.to, amount.toString(), response.data.encodedData]
            );
            console.log(tx, 'txResponse');
          } catch (error) {
            console.error('토큰 정보 조회 실패:', error);
          }
        },
      }
    );
    return;

    // 2. 기존 좋아요 로직 실행
    likePostMutation.mutate(post.id, {
      onSuccess: data => {
        setLocalLikeCount(data.data.likeCount);
        setLocalIsLiked(data.data.isLiked);
        // 싫어요가 활성화되어 있다면 비활성화
        if (data.data.isLiked && localIsHated) {
          setLocalIsHated(false);
          setLocalHateCount(prev => Math.max(0, prev - 1));
        }
      },
    });
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
  );
}
