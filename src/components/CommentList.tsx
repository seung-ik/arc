'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommentList as CommentListContainer,
  CommentItem,
  CommentHeader,
  CommentMeta,
  CommentAuthor,
  CommentDate,
  CommentActions,
  CommentLikeButton,
  ReplyButton,
  CommentContent,
  ReplyForm,
  ReplyTextarea,
  ReplySubmitButton,
  ReplyCancelButton,
  RepliesContainer,
  ReplyItem,
  ReplyContent,
  ReplyFooter,
  ReplyMeta,
  ReplyDate,
  ReplyAuthor,
  ToggleRepliesButton,
} from '@/styles/PostDetailStyles';

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

interface CommentListProps {
  comments: Comment[];
  onCommentLike?: (commentId: number) => void;
  onReplySubmit?: (commentId: number, content: string) => void;
}

export default function CommentList({
  comments,
  onCommentLike,
  onReplySubmit,
}: CommentListProps) {
  const router = useRouter();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(
    new Set()
  );

  const handleCommentLike = (commentId: number) => {
    if (onCommentLike) {
      onCommentLike(commentId);
    }
  };

  const handleReplyClick = (commentId: number) => {
    setReplyingTo(commentId);
    setReplyContent('');
  };

  const handleReplyCancel = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const handleReplySubmit = (parentCommentId: number) => {
    if (!replyContent.trim()) return;

    if (onReplySubmit) {
      onReplySubmit(parentCommentId, replyContent.trim());
    }

    setReplyContent('');
    setReplyingTo(null);
  };

  const handleToggleReplies = (commentId: number) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleAuthorClick = (authorId: string) => {
    router.push(`/profile/${authorId}`);
  };

  return (
    <CommentListContainer>
      {comments
        .sort((a, b) => b.likeCount - a.likeCount)
        .map(comment => (
          <CommentItem key={comment.id}>
            <CommentHeader>
              <CommentMeta>
                <CommentAuthor
                  onClick={() => handleAuthorClick(comment.authorId)}
                >
                  {comment.authorName}
                </CommentAuthor>
                <span>/</span>
                <CommentDate>{comment.date}</CommentDate>
              </CommentMeta>
              <CommentActions>
                <CommentLikeButton
                  onClick={() => handleCommentLike(comment.id)}
                  className={comment.isLiked ? 'liked' : ''}
                >
                  <span>❤️</span>
                  <span>{comment.likeCount}</span>
                </CommentLikeButton>
                <ReplyButton onClick={() => handleReplyClick(comment.id)}>
                  답글
                </ReplyButton>
              </CommentActions>
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>

            {replyingTo === comment.id && (
              <ReplyForm>
                <ReplyTextarea
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="답글을 입력하세요..."
                />
                <ReplyCancelButton onClick={handleReplyCancel}>
                  취소
                </ReplyCancelButton>
                <ReplySubmitButton
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  등록
                </ReplySubmitButton>
              </ReplyForm>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <>
                {!expandedReplies.has(comment.id) ? (
                  <ToggleRepliesButton
                    onClick={() => handleToggleReplies(comment.id)}
                  >
                    답글 {comment.replies.length}개 보기
                  </ToggleRepliesButton>
                ) : (
                  <>
                    <RepliesContainer>
                      {comment.replies
                        .sort(
                          (a, b) =>
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime()
                        )
                        .map(reply => (
                          <ReplyItem key={reply.id}>
                            <ReplyContent>{reply.content}</ReplyContent>
                            <ReplyFooter>
                              <ReplyMeta>
                                <ReplyDate>{reply.date}</ReplyDate>
                                <span>/</span>
                                <ReplyAuthor
                                  onClick={() =>
                                    handleAuthorClick(reply.authorId)
                                  }
                                >
                                  {reply.authorName}
                                </ReplyAuthor>
                              </ReplyMeta>
                            </ReplyFooter>
                          </ReplyItem>
                        ))}
                    </RepliesContainer>
                    <ToggleRepliesButton
                      onClick={() => handleToggleReplies(comment.id)}
                    >
                      답글 접기
                    </ToggleRepliesButton>
                  </>
                )}
              </>
            )}
          </CommentItem>
        ))}
    </CommentListContainer>
  );
}
