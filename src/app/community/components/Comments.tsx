'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { CommentData, ReplyData } from '@/types/comment';
import {
  useCreateCommentMutation,
  useCreateReplyMutation,
  useCommentsApi,
  useDeleteCommentMutation,
} from '@/api/useComment';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import {
  CommentsSection,
  CommentsHeader,
  CommentsDivider,
} from '@/styles/PostDetailStyles';
import React from 'react';

interface CommentsProps {
  postId: number;
  commentCount: number;
}

export default function Comments({ postId, commentCount }: CommentsProps) {
  const createCommentMutation = useCreateCommentMutation();
  const createReplyMutation = useCreateReplyMutation();
  const deleteCommentMutation = useDeleteCommentMutation();
  const { data: commentsData } = useCommentsApi(postId);
  const [comments, setComments] = useState<CommentData[]>([]);
  const { userProfile } = useAuthStore();

  // Handle successful comment creation
  const handleCommentSuccess = (data: any) => {
    const newCommentItem: CommentData = {
      id: data.data.id,
      content: data.data.content,
      createdAt: data.data.createdAt,
      updatedAt: data.data.createdAt, // createdAt과 동일하게 설정
      user: {
        id: userProfile.id,
        nickname: userProfile.nickname,
        profileImageUrl: userProfile.profileImageUrl,
      },
      postId: postId, // postId prop 사용
      replies: [],
      likeCount: data.data.likeCount,
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
          const newReply: ReplyData = {
            id: data.data.id,
            content: data.data.content,
            createdAt: data.data.createdAt,
            updatedAt: data.data.createdAt,
            user: {
              id: data.data.user.id,
              nickname: data.data.user.nickname,
              profileImageUrl: data.data.user.profileImageUrl,
            },
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
      const comments = commentsData.data;
      setComments(comments);
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
