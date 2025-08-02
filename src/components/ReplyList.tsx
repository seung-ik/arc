'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { formatDate, formatRelativeTime } from '@/utils';

import styled from 'styled-components';

const ReplyItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReplyContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ReplyDeleteButton = styled.span`
  font-size: 12px;
  color: #ff4444;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 8px;
  flex-shrink: 0;
`;

const RepliesContainer = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  padding-left: ${props => props.theme.spacing['lg']};
`;

const ReplyItem = styled.div`
  margin-bottom: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.backgroundGray};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const ReplyContent = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textBlack};
  line-height: 1.4;
  word-break: break-word;
`;

const ReplyMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
`;

const ReplyDate = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
`;

const ReplyAuthor = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

interface Reply {
  id: number;
  authorId: string;
  authorName: string;
  content: string;
  date: string;
  parentId?: number;
  likeCount: number;
  isLiked: boolean;
}

interface ReplyListProps {
  replies: Reply[];
  onDeleteReply?: (replyId: number) => void;
}

export default function ReplyList({ replies, onDeleteReply }: ReplyListProps) {
  const router = useRouter();
  const { userProfile } = useAuthStore();

  const handleDeleteReply = (replyId: number) => {
    if (confirm('정말로 이 답글을 삭제하시겠습니까?')) {
      if (onDeleteReply) {
        onDeleteReply(replyId);
      }
    }
  };

  const isMyReply = (reply: Reply) => {
    return reply.authorId === userProfile.id.toString();
  };

  const handleAuthorClick = (authorId: string) => {
    router.push(`/profile/${authorId}`);
  };

  return (
    <RepliesContainer>
      {replies
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(reply => (
          <ReplyItem key={reply.id}>
            <ReplyItemFooter>
              <ReplyMeta>
                <ReplyDate>
                  {formatDate(reply.date)} ({formatRelativeTime(reply.date)})
                </ReplyDate>
                <span>/</span>
                <ReplyAuthor onClick={() => handleAuthorClick(reply.authorId)}>
                  {reply.authorName}
                </ReplyAuthor>
              </ReplyMeta>
            </ReplyItemFooter>
            <ReplyContentWrapper>
              <ReplyContent>{reply.content}</ReplyContent>
              {isMyReply(reply) && (
                <ReplyDeleteButton onClick={() => handleDeleteReply(reply.id)}>
                  삭제
                </ReplyDeleteButton>
              )}
            </ReplyContentWrapper>
          </ReplyItem>
        ))}
    </RepliesContainer>
  );
}
