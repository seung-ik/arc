'use client';

import { useState, useEffect } from 'react';
import {
  useCreateCommentMutation,
  useCreateReplyMutation,
  useCommentsApi,
  useDeleteCommentMutation,
} from '@/api/useCommunity';
import CommentList from '@/components/CommentList';
import { Comment, normalizeApiComments } from '@/utils/commentUtils';
import {
  CommentsSection,
  CommentsHeader,
  CommentForm,
  CommentTextarea,
  CommentSubmitButton,
  CommentsDivider,
  CommentFooter,
  CharacterCounter,
} from '@/styles/PostDetailStyles';
import React from 'react';
import { useAuthStore } from '@/stores/authStore';

interface CommentSystemProps {
  postId: number;
  commentCount: number;
  title?: string;
  showCommentForm?: boolean;
  onCommentSubmit?: (comment: Comment) => void;
  onCommentDelete?: (commentId: number) => void;
  onReplySubmit?: (reply: Comment) => void;
  onReplyDelete?: (replyId: number) => void;
}

export default function CommentSystem({
  postId,
  commentCount,
  title = '댓글',
  showCommentForm = true,
  onCommentSubmit,
  onCommentDelete,
  onReplySubmit,
}: CommentSystemProps) {
  const createCommentMutation = useCreateCommentMutation();
  const createReplyMutation = useCreateReplyMutation();
  const deleteCommentMutation = useDeleteCommentMutation();
  const { data: commentsData, isLoading } = useCommentsApi(postId);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const { userProfile } = useAuthStore();

  // Handle successful comment creation
  const handleCommentSuccess = (data: any) => {
    const newCommentItem: Comment = {
      id: data.data.id,
      authorId: userProfile.id.toString(),
      authorName: userProfile.nickname || '사용자',
      content: data.data.content,
      date: data.data.createdAt,
      likeCount: data.data.likeCount,
      isLiked: false,
    };

    setComments(prev => [newCommentItem, ...prev]);

    // 부모 컴포넌트에 알림
    if (onCommentSubmit) {
      onCommentSubmit(newCommentItem);
    }
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId, {
      onSuccess: () => {
        console.log('댓글 삭제 성공');
        // 로컬 상태에서 댓글 제거
        setComments(prev => prev.filter(comment => comment.id !== commentId));

        // 부모 컴포넌트에 알림
        if (onCommentDelete) {
          onCommentDelete(commentId);
        }
      },
      onError: error => {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다.');
      },
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createCommentMutation.mutate(
      {
        postId: postId,
        content: newComment.trim(),
      },
      {
        onSuccess: handleCommentSuccess,
      }
    );

    setNewComment('');
  };

  const handleReplySubmit = (parentCommentId: number, content: string) => {
    createReplyMutation.mutate(
      {
        commentId: parentCommentId.toString(),
        content: content,
      },
      {
        onSuccess: data => {
          console.log(data);
          // Add the new reply to the state immediately
          const newReply: Comment = {
            id: data.data.id,
            authorId: data.data.user.id.toString(),
            authorName: data.data.user.nickname,
            content: data.data.content,
            date: data.data.createdAt,
            parentId: parentCommentId,
            likeCount: 0, // API 응답에 likeCount가 없으므로 기본값 사용
            isLiked: false,
          };

          setComments(prev =>
            prev.map(comment =>
              comment.id === parentCommentId
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), newReply],
                  }
                : comment
            )
          );

          // 부모 컴포넌트에 알림
          if (onReplySubmit) {
            onReplySubmit(newReply);
          }
        },
      }
    );
  };

  useEffect(() => {
    if (commentsData?.data) {
      const normalizedComments = normalizeApiComments(commentsData.data);
      setComments(normalizedComments);
    }
  }, [commentsData]);

  return (
    <CommentsSection>
      <CommentsDivider />
      <CommentsHeader>
        {title} ({commentCount})
      </CommentsHeader>

      {showCommentForm && (
        <CommentForm>
          <CommentTextarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="내용을 입력해주세요."
          />
          <CommentFooter>
            <CharacterCounter>{newComment.length} / 200</CharacterCounter>
            <CommentSubmitButton
              onClick={handleCommentSubmit}
              disabled={!newComment.trim() || newComment.length > 200}
            >
              등록
            </CommentSubmitButton>
          </CommentFooter>
        </CommentForm>
      )}

      {isLoading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          댓글을 불러오는 중...
        </div>
      ) : (
        <CommentList
          comments={comments as any}
          onReplySubmit={handleReplySubmit}
          onDeleteComment={handleDeleteComment}
        />
      )}
    </CommentsSection>
  );
}
