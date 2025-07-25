'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostHeader from '@/components/PostHeader';
import CommentSection from '@/components/CommentSection';
import {
  Container,
  Content,
  PostContent,
  PostActions,
  ActionButtons,
  ActionButton,
  ButtonText,
  ButtonCount,
  ManagementSection,
  ManagementTitle,
  ManagementButtons,
  ManagementButton,
} from '@/styles/PostDetailStyles';
import { GeneralPost } from '@/types/post';

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

interface GeneralMyPostDetailProps {
  post: GeneralPost;
}

export default function GeneralMyPostDetail({
  post,
}: GeneralMyPostDetailProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);

  const handleLike = () => {
    // TODO: 좋아요 처리
    console.log('Like post:', post.id);
  };

  const handleDislike = () => {
    // TODO: 싫어요 처리
    console.log('Dislike post:', post.id);
  };

  const handleCommentSubmit = (content: string) => {
    const comment: Comment = {
      id: Date.now(),
      authorId: 'currentUser',
      authorName: '현재사용자',
      content: content,
      date: new Date().toISOString().split('T')[0],
      likeCount: 0,
      isLiked: false,
    };

    setComments(prev => [comment, ...prev]);
  };

  const handleCommentLike = (commentId: number) => {
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
  };

  const handleReplySubmit = (parentCommentId: number, content: string) => {
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
  };

  const handleAuthorClick = (authorId: string) => {
    router.push(`/profile/${authorId}`);
  };

  const handleDelete = () => {
    // TODO: 삭제 처리
    console.log('Delete post:', post.id);
  };

  return (
    <Container>
      <Content>
        <PostHeader
          title={post.title}
          authorId={post.authorId}
          authorName={post.authorName}
          date={post.date}
          postType={post.postType}
          viewCount={post.viewCount}
        />

        <PostContent>{post.content}</PostContent>

        <PostActions>
          <ActionButtons>
            <ActionButton
              onClick={handleLike}
              $isActive={post.isLiked}
              $variant="like"
            >
              <ButtonText>좋아요</ButtonText>
              <ButtonCount>{post.likeCount}</ButtonCount>
            </ActionButton>
            <ActionButton
              onClick={handleDislike}
              $isActive={post.isDisliked}
              $variant="dislike"
            >
              <ButtonText>싫어요</ButtonText>
              <ButtonCount>{post.dislikeCount}</ButtonCount>
            </ActionButton>
          </ActionButtons>
        </PostActions>

        <ManagementSection>
          <ManagementTitle>게시글 관리</ManagementTitle>
          <ManagementButtons>
            <ManagementButton onClick={handleDelete} $variant="delete">
              삭제
            </ManagementButton>
          </ManagementButtons>
        </ManagementSection>

        <CommentSection
          commentCount={post.commentCount}
          comments={comments}
          onCommentSubmit={handleCommentSubmit}
          onCommentLike={handleCommentLike}
          onReplySubmit={handleReplySubmit}
          onAuthorClick={handleAuthorClick}
        />
      </Content>
    </Container>
  );
}
