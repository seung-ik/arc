'use client';

import { useState, useEffect } from 'react';
import {
  useCreateCommentMutation,
  useCreateReplyMutation,
  useCommentsApi,
  useDeleteCommentMutation,
} from '@/api/useCommunity';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { Comment, normalizeApiComments } from '@/utils/commentUtils';
import {
  CommentsSection,
  CommentsHeader,
  CommentsDivider,
} from '@/styles/PostDetailStyles';
import React from 'react';
import { useAuthStore } from '@/stores/authStore';

interface CommentsProps {
  postId: number;
  commentCount: number;
}

export default function Comments({ postId, commentCount }: CommentsProps) {
  const createCommentMutation = useCreateCommentMutation();
  const createReplyMutation = useCreateReplyMutation();
  const deleteCommentMutation = useDeleteCommentMutation();
  const { data: commentsData } = useCommentsApi(postId);
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
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId, {
      onSuccess: () => {
        console.log('댓글 삭제 성공');
        // 로컬 상태에서 댓글 제거
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      },
      onError: error => {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다.');
      },
    });
  };

  const handleCommentSubmit = (content: string) => {
    createCommentMutation.mutate(
      {
        postId: postId,
        content: content,
      },
      {
        onSuccess: handleCommentSuccess,
      }
    );
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
      <CommentsHeader>댓글 ({commentCount})</CommentsHeader>

      <CommentForm onSubmit={handleCommentSubmit} />

      <CommentList
        comments={comments as any}
        onReplySubmit={handleReplySubmit}
        onDeleteComment={handleDeleteComment}
      />
    </CommentsSection>
  );
}
