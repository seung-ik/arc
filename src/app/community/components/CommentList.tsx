'use client';

import { useState, useEffect } from 'react';
import { CommentList as CommentListContainer } from '@/styles/PostDetailStyles';
import CommentItem from './CommentItem';
import { CommentData } from '@/types/comment';

interface CommentListProps {
  comments: CommentData[];
  onReplySubmit?: (commentId: number, content: string) => void;
  onDeleteComment?: (commentId: number) => void;
}

export default function CommentList({
  comments,
  onReplySubmit,
  onDeleteComment,
}: CommentListProps) {
  const [localComments, setLocalComments] = useState<CommentData[]>(comments);

  // Update local comments when props change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleDeleteComment = (commentId: number) => {
    if (onDeleteComment) {
      onDeleteComment(commentId);
    }
  };

  return (
    <CommentListContainer>
      {localComments
        .sort((a, b) => b.likeCount - a.likeCount)
        .map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReplySubmit={onReplySubmit}
            onDeleteComment={handleDeleteComment}
          />
        ))}
    </CommentListContainer>
  );
}
