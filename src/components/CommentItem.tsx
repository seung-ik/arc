'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useLikeCommentMutation } from '@/api/useCommunity';
import ReplyForm from '@/components/ReplyForm';
import ReplyList from '@/components/ReplyList';
import { formatDate, formatRelativeTime } from '@/utils';
import styled from 'styled-components';
import Image from 'next/image';
import { ICONS } from '@/assets';

const CommentItemContainer = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: white;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
`;

const CommentAuthor = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const CommentDate = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-left: ${props => props.theme.spacing.xs};
`;

const ActionDivider = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${props => props.theme.colors.border};
  margin: 0 ${props => props.theme.spacing.xs};
`;

const CommentLikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGray};
  }

  &.liked {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.secondaryLight};
  }
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGray};
  }
`;

const CommentContent = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.textBlack};
  line-height: 1.5;
  word-break: break-word;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const DeleteButton = styled.span`
  font-size: 12px;
  color: #ff4444;
  cursor: pointer;
  text-decoration: underline;
`;

const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

interface Comment {
  id: number;
  authorId: string;
  authorName: string;
  content: string;
  date: string;
  parentId?: number;
  replies?: Comment[];
  likeCount: number;
  isLiked: boolean;
}

interface CommentItemProps {
  comment: Comment;
  onReplySubmit?: (commentId: number, content: string) => void;
  onDeleteComment?: (commentId: number) => void;
}

export default function CommentItem({
  comment,
  onReplySubmit,
  onDeleteComment,
}: CommentItemProps) {
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const likeCommentMutation = useLikeCommentMutation();
  const [expandedReplies, setExpandedReplies] = useState<boolean>(false);
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [localLikeCount, setLocalLikeCount] = useState<number>(
    comment.likeCount
  );

  const [localIsLiked, setLocalIsLiked] = useState<boolean>(comment.isLiked);
  console.log(localIsLiked, comment);
  const handleCommentLike = () => {
    likeCommentMutation.mutate(comment.id, {
      onSuccess: data => {
        // API 응답으로 실제 상태 업데이트
        setLocalLikeCount(data.data.likeCount);
        setLocalIsLiked(data.data.isLiked);
      },
    });
  };

  const handleDeleteComment = () => {
    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      if (onDeleteComment) {
        onDeleteComment(comment.id);
      }
    }
  };

  // 헬퍼 함수들
  const hasReplies = !!(comment.replies && comment.replies.length > 0);
  const isMyComment = comment.authorId === userProfile.id.toString();

  const getReplyButtonText = (): string => {
    if (!hasReplies) return '답글';
    return expandedReplies
      ? '답글 접기'
      : `답글 ${comment.replies ? comment.replies.length : 0}개`;
  };

  const handleAuthorClick = (authorId: string): void => {
    router.push(`/profile/${authorId}`);
  };

  const handleToggleReplies = () => {
    setExpandedReplies(prev => !prev);
    if (expandedReplies) {
      // 답글을 접을 때는 입력 폼도 함께 닫기
      setShowReplyForm(false);
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(prev => !prev);
  };

  return (
    <CommentItemContainer>
      <CommentHeader>
        <CommentMeta>
          <CommentAuthor onClick={() => handleAuthorClick(comment.authorId)}>
            {comment.authorName}
          </CommentAuthor>
          <span>/</span>
          <CommentDate>
            {formatDate(comment.date)} ({formatRelativeTime(comment.date)})
          </CommentDate>
        </CommentMeta>
        <CommentActions>
          <ReplyButton
            onClick={hasReplies ? handleToggleReplies : handleReplyClick}
          >
            {getReplyButtonText()}
          </ReplyButton>
          <ActionDivider />
          <CommentLikeButton
            onClick={handleCommentLike}
            className={localIsLiked ? 'liked' : ''}
          >
            <Image src={ICONS.GOOD} alt="좋아요" />
            <span>{localLikeCount}</span>
          </CommentLikeButton>
        </CommentActions>
      </CommentHeader>
      <CommentContent>{comment.content}</CommentContent>

      {hasReplies && expandedReplies && (
        <>
          <ReplyList replies={comment.replies!} />
          <ReplyForm
            onSubmit={content => {
              if (onReplySubmit) {
                onReplySubmit(comment.id, content);
              }
              setShowReplyForm(false);
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </>
      )}

      {showReplyForm && !hasReplies && (
        <ReplyFormWrapper>
          <ReplyForm
            onSubmit={content => {
              if (onReplySubmit) {
                onReplySubmit(comment.id, content);
              }
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </ReplyFormWrapper>
      )}

      {isMyComment && (
        <DeleteButtonWrapper>
          <DeleteButton onClick={handleDeleteComment}>삭제</DeleteButton>
        </DeleteButtonWrapper>
      )}
    </CommentItemContainer>
  );
}

const ReplyFormWrapper = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
`;
