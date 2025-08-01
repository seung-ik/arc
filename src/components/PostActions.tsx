'use client';

import styled from 'styled-components';

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
  likeCount?: number;
  dislikeCount?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
}

export default function PostActions({
  likeCount = 0,
  dislikeCount = 0,
  isLiked = false,
  isDisliked = false,
  onLike,
  onDislike,
}: PostActionsProps) {
  return (
    <PostActionsContainer>
      <ActionButtons>
        <ActionButton onClick={onLike} $isActive={isLiked} $variant="like">
          <ButtonText>좋아요</ButtonText>
          <ButtonCount>{likeCount}</ButtonCount>
        </ActionButton>
        <ActionButton
          onClick={onDislike}
          $isActive={isDisliked}
          $variant="dislike"
        >
          <ButtonText>싫어요</ButtonText>
          <ButtonCount>{dislikeCount}</ButtonCount>
        </ActionButton>
      </ActionButtons>
    </PostActionsContainer>
  );
}
