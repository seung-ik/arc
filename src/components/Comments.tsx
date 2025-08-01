'use client';

import { useState, useEffect } from 'react';
import { useCreateCommentMutation, useCommentsApi } from '@/api/useCommunity';
import CommentList from '@/components/CommentList';
import { Comment, normalizeApiComments } from '@/utils/commentUtils';
import {
  CommentsSection,
  CommentsHeader,
  CommentForm,
  CommentTextarea,
  CommentSubmitButton,
} from '@/styles/PostDetailStyles';
import React from 'react';

interface CommentsProps {
  postId: number;
  commentCount: number;
  onCommentSubmit?: (content: string) => void;
  onCommentLike?: (commentId: number) => void;
  onReplySubmit?: (commentId: number, content: string) => void;
}

export default function Comments({
  postId,
  commentCount,
  onCommentSubmit,
  onCommentLike,
  onReplySubmit,
}: CommentsProps) {
  const createCommentMutation = useCreateCommentMutation();
  const { data: commentsData, isLoading } = useCommentsApi(postId);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  // Handle successful comment creation
  const handleCommentSuccess = (data: any) => {
    const newCommentItem: Comment = {
      id: data.data.id,
      authorId: data.data.user.id,
      authorName: data.data.user.nickname,
      content: data.data.content,
      date: data.data.createdAt,
      likeCount: data.data.likeCount,
      isLiked: false,
    };

    setComments(prev => [newCommentItem, ...prev]);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (onCommentSubmit) {
      onCommentSubmit(newComment.trim());
    } else {
      // Use API mutation
      createCommentMutation.mutate(
        {
          postId: postId,
          content: newComment.trim(),
        },
        {
          onSuccess: handleCommentSuccess,
        }
      );
    }

    setNewComment('');
  };

  const handleCommentLike = (commentId: number) => {
    if (onCommentLike) {
      onCommentLike(commentId);
    } else {
      // Update local state immediately
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likeCount: comment.isLiked
                  ? comment.likeCount - 1
                  : comment.likeCount + 1,
              }
            : comment
        )
      );
    }
  };

  const handleReplySubmit = (parentCommentId: number, content: string) => {
    if (onReplySubmit) {
      onReplySubmit(parentCommentId, content);
    } else {
      // Add reply to local state immediately
      const reply: Comment = {
        id: Date.now(),
        authorId: 'currentUser',
        authorName: '현재사용자',
        content: content,
        date: new Date().toISOString().split('T')[0],
        parentId: parentCommentId,
        likeCount: 0,
        isLiked: false,
      };

      setComments(prev =>
        prev.map(comment =>
          comment.id === parentCommentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), reply],
              }
            : comment
        )
      );
    }
  };

  useEffect(() => {
    if (commentsData?.data) {
      const normalizedComments = normalizeApiComments(commentsData.data);
      setComments(normalizedComments);
    }
  }, [commentsData]);

  return (
    <CommentsSection>
      <CommentsHeader>댓글 ({commentCount})</CommentsHeader>

      <CommentForm>
        <CommentTextarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
        />
        <CommentSubmitButton
          onClick={handleCommentSubmit}
          disabled={!newComment.trim()}
        >
          등록
        </CommentSubmitButton>
      </CommentForm>

      {isLoading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          댓글을 불러오는 중...
        </div>
      ) : (
        <CommentList
          comments={comments}
          onCommentLike={handleCommentLike}
          onReplySubmit={handleReplySubmit}
        />
      )}
    </CommentsSection>
  );
}
