'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useLikePostMutation, useHatePostMutation } from '@/api/useCommunity';
import { GeneralPost } from '@/types/post';

const PostActionsContainer = styled.div`
  margin: ${props => props.theme.spacing.md} 0;
  padding: ${props => props.theme.spacing.md} 0;
  border-top: 1px solid ${props => props.theme.colors.border};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const ActionButton = styled.button<{
  $isActive: boolean;
  $variant: 'like' | 'dislike';
}>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props =>
    props.$isActive
      ? props.$variant === 'like'
        ? props.theme.colors.success
        : props.theme.colors.error
      : props.theme.colors.background};
  color: ${props =>
    props.$isActive
      ? props.theme.colors.textWhite
      : props.theme.colors.textBlack};
  cursor: pointer;
  transition: all 0.2s;
  font-size: ${props => props.theme.typography.fontSizes.sm};

  &:hover {
    background-color: ${props =>
      props.$variant === 'like'
        ? props.theme.colors.success
        : props.theme.colors.error};
    color: ${props => props.theme.colors.textWhite};
  }
`;

const ButtonText = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const ButtonCount = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  opacity: 0.8;
`;

interface PostActionsProps {
  post: GeneralPost;
}

export default function PostActions({ post }: PostActionsProps) {
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount || 0);
  const [localHateCount, setLocalHateCount] = useState(post.hateCount || 0);
  const [localIsLiked, setLocalIsLiked] = useState(post.isLiked || false);
  const [localIsHated, setLocalIsHated] = useState(post.isHated || false);

  const likePostMutation = useLikePostMutation();
  const hatePostMutation = useHatePostMutation();

  const handleLike = () => {
    likePostMutation.mutate(post.id, {
      onSuccess: (data) => {
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
      onSuccess: (data) => {
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
        <ActionButton onClick={handleLike} $isActive={localIsLiked} $variant="like">
          <ButtonText>좋아요</ButtonText>
          <ButtonCount>{localLikeCount}</ButtonCount>
        </ActionButton>
        <ActionButton
          onClick={handleDislike}
          $isActive={localIsHated}
          $variant="dislike"
        >
          <ButtonText>싫어요</ButtonText>
          <ButtonCount>{localHateCount}</ButtonCount>
        </ActionButton>
      </ActionButtons>
    </PostActionsContainer>
  );
}
