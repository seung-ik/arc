'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Content,
  PostHeader,
  PostTitle,
  PostTitleRow,
  PostTitleContainer,
  ViewCount,
  PostMeta,
  AuthorInfo,
  AuthorName,
  PostDate,
  PostTypeBadge,
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
  ManagementSection,
  ManagementTitle,
  ManagementButtons,
  ManagementButton,
  MentorInfoSection,
  MentorInfoGrid,
  MentorInfoItem,
  MentorInfoLabel,
  MentorInfoValue,
  PriceValue,
} from '@/styles/PostDetailStyles';

interface Post {
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
  // 멘토 전용 필드들
  mentorLevel?: string;
  experience?: string;
  lessonType?: string;
  price?: string;
  location?: string;
  // 프로필 노출 관련
  showInProfile?: boolean;
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

interface MentorMyPostDetailProps {
  post: Post;
}

export default function MentorMyPostDetail({ post }: MentorMyPostDetailProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  const handleEdit = () => {
    // TODO: 수정 처리
    console.log('Edit post:', post.id);
  };

  const handleDelete = () => {
    // TODO: 삭제 처리
    console.log('Delete post:', post.id);
  };

  const handleToggleProfile = () => {
    // TODO: 프로필 노출 토글 처리
    console.log('Toggle profile visibility:', post.id);
  };

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

  const handleAuthorClick = (authorId: string) => {
    router.push(`/profile/${authorId}`);
  };

  return (
    <Container>
      <Content>
        <PostHeader>
          <PostTitleRow>
            <PostTitleContainer>
              <PostTitle>{post.title}</PostTitle>
            </PostTitleContainer>
            <ViewCount>조회 {post.viewCount}</ViewCount>
          </PostTitleRow>
          <PostMeta>
            <AuthorInfo>
              <AuthorName>{post.authorName}</AuthorName>
              <PostDate>{post.date}</PostDate>
            </AuthorInfo>
            <PostTypeBadge>{post.postType}</PostTypeBadge>
          </PostMeta>
        </PostHeader>

        <MentorInfoSection>
          <MentorInfoGrid>
            {post.mentorLevel && (
              <MentorInfoItem>
                <MentorInfoLabel>멘토 레벨</MentorInfoLabel>
                <MentorInfoValue>{post.mentorLevel}</MentorInfoValue>
              </MentorInfoItem>
            )}

            {post.experience && (
              <MentorInfoItem>
                <MentorInfoLabel>경력</MentorInfoLabel>
                <MentorInfoValue>{post.experience}</MentorInfoValue>
              </MentorInfoItem>
            )}

            {post.lessonType && (
              <MentorInfoItem>
                <MentorInfoLabel>레슨 유형</MentorInfoLabel>
                <MentorInfoValue>{post.lessonType}</MentorInfoValue>
              </MentorInfoItem>
            )}

            {post.price && (
              <MentorInfoItem>
                <MentorInfoLabel>레슨 비용</MentorInfoLabel>
                <PriceValue>{post.price}</PriceValue>
              </MentorInfoItem>
            )}

            {post.location && (
              <MentorInfoItem>
                <MentorInfoLabel>위치</MentorInfoLabel>
                <MentorInfoValue>{post.location}</MentorInfoValue>
              </MentorInfoItem>
            )}
          </MentorInfoGrid>
        </MentorInfoSection>

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

        <ManagementSection>
          <ManagementTitle>게시글 관리</ManagementTitle>
          <ManagementButtons>
            <ManagementButton onClick={handleEdit} $variant="edit">
              수정
            </ManagementButton>
            <ManagementButton onClick={handleDelete} $variant="delete">
              삭제
            </ManagementButton>
            <ManagementButton onClick={handleToggleProfile} $variant="profile">
              {post.showInProfile ? '프로필에서 숨기기' : '프로필에 노출'}
            </ManagementButton>
          </ManagementButtons>
        </ManagementSection>

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
                      <CommentAuthor onClick={() => handleAuthorClick(comment.authorId)}>
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
                                        onClick={() => handleAuthorClick(reply.authorId)}
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
