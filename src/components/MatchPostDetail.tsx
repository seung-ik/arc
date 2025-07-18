'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import PostHeader from '@/components/PostHeader';
import MatchInfo from '@/components/MatchInfo';
import {
  Container,
  Content,
  PostContent,
  PostActions,
  ActionButtons,
  ActionButton,
  ButtonText,
  ButtonCount,
  CommentsSection,
  CommentsHeader,
  CommentForm,
  CommentTextarea,
  CommentSubmitButton,
  CommentList,
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
  ReplyCancelButton,
  ReplySubmitButton,
  ToggleRepliesButton,
  RepliesContainer,
  ReplyItem,
  ReplyContent,
  ReplyFooter,
  ReplyMeta,
  ReplyDate,
  ReplyAuthor,
  JoinButton,
} from '@/styles/PostDetailStyles';

interface MatchPost {
  id: number;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  date: string;
  category: string;
  postType: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  // 매치 전용 필드들
  elo?: number;
  location?: string;
  desiredSkillLevel?: string;
  validityPeriod?: number;
  participants?: string[];
  maxParticipants?: number;
}

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

interface MatchPostDetailProps {
  post: MatchPost;
}

export default function MatchPostDetail({ post }: MatchPostDetailProps) {
  const router = useRouter();
  const [isJoined, setIsJoined] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  const handleJoin = () => {
    setIsJoined(!isJoined);
    // TODO: 실제 매치 참가 로직 구현
  };

  const isExpired = (validityPeriod: number) => validityPeriod <= 0;

  const handleLike = () => {
    // TODO: 좋아요 처리
    console.log('Like post:', post.id);
  };

  const handleDislike = () => {
    // TODO: 싫어요 처리
    console.log('Dislike post:', post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      authorId: 'currentUser',
      authorName: '현재사용자',
      content: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
      likeCount: 0,
      isLiked: false,
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment('');
  };

  const handleCommentLike = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
            }
          : comment,
      ),
    );
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

    const reply: Comment = {
      id: Date.now(),
      authorId: 'currentUser',
      authorName: '현재사용자',
      content: replyContent.trim(),
      date: new Date().toISOString().split('T')[0],
      parentId: parentCommentId,
      likeCount: 0,
      isLiked: false,
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === parentCommentId
          ? {
              ...comment,
              replies: [...(comment.replies || []), reply],
            }
          : comment,
      ),
    );

    setReplyContent('');
    setReplyingTo(null);
  };

  const handleToggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
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

        <MatchInfo
          elo={post.elo}
          location={post.location}
          desiredSkillLevel={post.desiredSkillLevel}
          validityPeriod={post.validityPeriod}
        />

        <PostContent>{post.content}</PostContent>

        <PostActions>
          <ActionButtons>
            <ActionButton onClick={handleLike} $isActive={post.isLiked} $variant="like">
              <ButtonText>좋아요</ButtonText>
              <ButtonCount>{post.likeCount}</ButtonCount>
            </ActionButton>
            <ActionButton onClick={handleDislike} $isActive={post.isDisliked} $variant="dislike">
              <ButtonText>싫어요</ButtonText>
              <ButtonCount>{post.dislikeCount}</ButtonCount>
            </ActionButton>
          </ActionButtons>
        </PostActions>

        <CommentsSection>
          <CommentsHeader>댓글 ({post.commentCount})</CommentsHeader>

          <CommentForm>
            <CommentTextarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
            <CommentSubmitButton onClick={handleCommentSubmit} disabled={!newComment.trim()}>
              등록
            </CommentSubmitButton>
          </CommentForm>

          <CommentList>
            {comments
              .sort((a, b) => b.likeCount - a.likeCount)
              .map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentHeader>
                    <CommentMeta>
                      <CommentAuthor onClick={() => router.push(`/profile/${comment.authorId}`)}>
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
                      <ReplyButton onClick={() => handleReplyClick(comment.id)}>답글</ReplyButton>
                    </CommentActions>
                  </CommentHeader>
                  <CommentContent>{comment.content}</CommentContent>

                  {replyingTo === comment.id && (
                    <ReplyForm>
                      <ReplyTextarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답글을 입력하세요..."
                      />
                      <ReplyCancelButton onClick={handleReplyCancel}>취소</ReplyCancelButton>
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
                        <ToggleRepliesButton onClick={() => handleToggleReplies(comment.id)}>
                          답글 {comment.replies.length}개 보기
                        </ToggleRepliesButton>
                      ) : (
                        <>
                          <RepliesContainer>
                            {comment.replies
                              .sort(
                                (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
                              )
                              .map((reply) => (
                                <ReplyItem key={reply.id}>
                                  <ReplyContent>{reply.content}</ReplyContent>
                                  <ReplyFooter>
                                    <ReplyMeta>
                                      <ReplyDate>{reply.date}</ReplyDate>
                                      <span>/</span>
                                      <ReplyAuthor
                                        onClick={() => router.push(`/profile/${reply.authorId}`)}
                                      >
                                        {reply.authorName}
                                      </ReplyAuthor>
                                    </ReplyMeta>
                                  </ReplyFooter>
                                </ReplyItem>
                              ))}
                          </RepliesContainer>
                          <ToggleRepliesButton onClick={() => handleToggleReplies(comment.id)}>
                            답글 접기
                          </ToggleRepliesButton>
                        </>
                      )}
                    </>
                  )}
                </CommentItem>
              ))}
          </CommentList>
        </CommentsSection>
      </Content>
    </Container>
  );
}
