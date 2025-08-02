'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useLikeCommentMutation } from '@/api/useCommunity';
import { useEffect } from 'react';
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
  onReplySubmit?: (commentId: number, content: string) => void;
  onDeleteComment?: (commentId: number) => void;
  onDeleteReply?: (replyId: number) => void;
}

export default function CommentList({
  comments,
  onReplySubmit,
  onDeleteComment,
  onDeleteReply,
}: CommentListProps) {
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const likeCommentMutation = useLikeCommentMutation();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(
    new Set(
      comments
        .filter(comment => comment.replies && comment.replies.length > 0)
        .map(comment => comment.id)
    )
  );

  // Update local comments when props change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleCommentLike = (commentId: number) => {
    likeCommentMutation.mutate(commentId, {
      onSuccess: (data) => {
        setLocalComments(prev =>
          prev.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  likeCount: data.data.likeCount,
                  isLiked: data.data.isLiked,
                }
              : comment
          )
        );
      },
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      if (onDeleteComment) {
        onDeleteComment(commentId);
      }
    }
  };

  const handleDeleteReply = (replyId: number) => {
    if (confirm('정말로 이 답글을 삭제하시겠습니까?')) {
      if (onDeleteReply) {
        onDeleteReply(replyId);
      }
    }
  };

  const isMyComment = (comment: Comment) => {
    return comment.authorId === userProfile.id.toString();
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
      {localComments
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
                {isMyComment(comment) && (
                  <button onClick={() => handleDeleteComment(comment.id)}>
                    삭제
                  </button>
                )}
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
                              {isMyComment(reply) && (
                                <button
                                  onClick={() => handleDeleteReply(reply.id)}
                                  style={{
                                    marginLeft: '8px',
                                    padding: '2px 6px',
                                    fontSize: '12px',
                                    color: '#ff4444',
                                    background: 'none',
                                    border: '1px solid #ff4444',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  삭제
                                </button>
                              )}
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
