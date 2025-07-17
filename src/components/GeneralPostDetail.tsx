'use client';

import styled from 'styled-components';

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

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
  padding: ${(props) => props.theme.spacing.md};
`;

const PostHeader = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding-bottom: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const PostTitle = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: 0 0 ${(props) => props.theme.spacing.sm} 0;
  line-height: 1.4;
`;

const PostTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const PostTitleContainer = styled.div`
  flex: 1;
`;

const ViewCount = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textGray};
  flex-shrink: 0;
  margin-left: ${(props) => props.theme.spacing.md};
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const AuthorName = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textBlack};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const PostDate = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textGray};
`;

const CategoryBadge = styled.span`
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const PostTypeBadge = styled.span`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const PostContent = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  line-height: 1.8;
  color: ${(props) => props.theme.colors.textBlack};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  white-space: pre-wrap;
  word-break: break-word;
`;

const PostActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.lg} 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  justify-content: center;
`;

const ActionButton = styled.button<{ $isActive: boolean; $variant: 'like' | 'dislike' }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  background: ${(props) =>
    props.$isActive ? (props.$variant === 'like' ? '#fdf2f2' : '#f8f9fa') : 'white'};
  border: 1px solid
    ${(props) =>
      props.$isActive
        ? props.$variant === 'like'
          ? '#e74c3c'
          : '#6c757d'
        : props.theme.colors.border};
  color: ${(props) =>
    props.$isActive
      ? props.$variant === 'like'
        ? '#e74c3c'
        : '#6c757d'
      : props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: all 0.2s;
  min-width: 80px;
  justify-content: center;

  &:hover {
    background-color: ${(props) =>
      props.$isActive ? (props.$variant === 'like' ? '#fdf2f2' : '#f8f9fa') : '#f8f9fa'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonText = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const ButtonCount = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  color: ${(props) => props.theme.colors.textLightGray};
`;

const CommentsSection = styled.div`
  margin-top: ${(props) => props.theme.spacing.xl};
`;

const CommentsHeader = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const CommentForm = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
  position: relative;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: ${(props) => props.theme.spacing.md};
  padding-right: 80px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textBlack};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textGray};
  }
`;

const CommentSubmitButton = styled.button`
  position: absolute;
  top: ${(props) => props.theme.spacing.sm};
  right: ${(props) => props.theme.spacing.sm};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.textWhite};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 50px;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const CommentItem = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: white;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textGray};
`;

const CommentAuthor = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textBlack};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const CommentDate = styled.span`
  color: ${(props) => props.theme.colors.textGray};
`;

const CommentActions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`;

const CommentLikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textGray};
  transition: color 0.2s;

  &:hover {
    color: #e74c3c;
  }

  &.liked {
    color: #e74c3c;
  }
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textGray};
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const CommentContent = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  line-height: 1.6;
  color: ${(props) => props.theme.colors.textBlack};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const ReplyForm = styled.div`
  margin-top: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  position: relative;
`;

const ReplyTextarea = styled.textarea`
  width: 100%;
  padding: ${(props) => props.theme.spacing.sm};
  padding-right: 120px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  background-color: white;
  color: ${(props) => props.theme.colors.textBlack};
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  line-height: 1.4;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textGray};
  }
`;

const ReplyCancelButton = styled.button`
  position: absolute;
  top: ${(props) => props.theme.spacing.xs};
  right: 60px;
  background-color: ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.textGray};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.xs};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.textGray};
    color: white;
  }
`;

const ReplySubmitButton = styled.button`
  position: absolute;
  top: ${(props) => props.theme.spacing.xs};
  right: ${(props) => props.theme.spacing.xs};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.textWhite};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.xs};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const ToggleRepliesButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.primary};
  margin-top: ${(props) => props.theme.spacing.sm};
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primaryHover};
  }
`;

const RepliesContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing.sm};
  padding-left: ${(props) => props.theme.spacing.md};
  border-left: 2px solid ${(props) => props.theme.colors.border};
`;

const ReplyItem = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.sm};
`;

const ReplyContent = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  line-height: 1.5;
  color: ${(props) => props.theme.colors.textBlack};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const ReplyFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReplyMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  color: ${(props) => props.theme.colors.textGray};
`;

const ReplyDate = styled.span`
  color: ${(props) => props.theme.colors.textGray};
`;

const ReplyAuthor = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textBlack};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

// 카테고리 한글 이름 매핑
const CATEGORY_LABELS: { [key: string]: string } = {
  tennis: '테니스',
  badminton: '배드민턴',
  'table-tennis': '탁구',
  billiards: '당구',
  go: '바둑',
  chess: '체스',
};

interface GeneralPostDetailProps {
  post: Post;
  comments: Comment[];
  onLike: () => void;
  onDislike: () => void;
  onCommentSubmit: (e: React.FormEvent) => void;
  onCommentLike: (commentId: number) => void;
  onReplyClick: (commentId: number) => void;
  onReplyCancel: () => void;
  onReplySubmit: (parentCommentId: number) => void;
  onToggleReplies: (commentId: number) => void;
  onAuthorClick: (authorId: string) => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  replyingTo: number | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  expandedReplies: Set<number>;
}

export default function GeneralPostDetail({
  post,
  comments,
  onLike,
  onDislike,
  onCommentSubmit,
  onCommentLike,
  onReplyClick,
  onReplyCancel,
  onReplySubmit,
  onToggleReplies,
  onAuthorClick,
  newComment,
  setNewComment,
  replyingTo,
  replyContent,
  setReplyContent,
  expandedReplies,
}: GeneralPostDetailProps) {
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
              <AuthorName onClick={() => onAuthorClick(post.authorId)}>
                {post.authorName}
              </AuthorName>
              <PostDate>{post.date}</PostDate>
            </AuthorInfo>
            <CategoryBadge>{CATEGORY_LABELS[post.category] || post.category}</CategoryBadge>
            <PostTypeBadge>{post.postType}</PostTypeBadge>
          </PostMeta>
        </PostHeader>

        <PostContent>{post.content}</PostContent>

        <PostActions>
          <ActionButtons>
            <ActionButton onClick={onLike} $isActive={post.isLiked} $variant="like">
              <ButtonText>좋아요</ButtonText>
              <ButtonCount>{post.likeCount}</ButtonCount>
            </ActionButton>
            <ActionButton onClick={onDislike} $isActive={post.isDisliked} $variant="dislike">
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
            <CommentSubmitButton onClick={onCommentSubmit} disabled={!newComment.trim()}>
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
                      <CommentAuthor onClick={() => onAuthorClick(comment.authorId)}>
                        {comment.authorName}
                      </CommentAuthor>
                      <span>/</span>
                      <CommentDate>{comment.date}</CommentDate>
                    </CommentMeta>
                    <CommentActions>
                      <CommentLikeButton
                        onClick={() => onCommentLike(comment.id)}
                        className={comment.isLiked ? 'liked' : ''}
                      >
                        <span>❤️</span>
                        <span>{comment.likeCount}</span>
                      </CommentLikeButton>
                      <ReplyButton onClick={() => onReplyClick(comment.id)}>답글</ReplyButton>
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
                      <ReplyCancelButton onClick={onReplyCancel}>취소</ReplyCancelButton>
                      <ReplySubmitButton
                        onClick={() => onReplySubmit(comment.id)}
                        disabled={!replyContent.trim()}
                      >
                        등록
                      </ReplySubmitButton>
                    </ReplyForm>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <>
                      {!expandedReplies.has(comment.id) ? (
                        <ToggleRepliesButton onClick={() => onToggleReplies(comment.id)}>
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
                                      <ReplyAuthor onClick={() => onAuthorClick(reply.authorId)}>
                                        {reply.authorName}
                                      </ReplyAuthor>
                                    </ReplyMeta>
                                  </ReplyFooter>
                                </ReplyItem>
                              ))}
                          </RepliesContainer>
                          <ToggleRepliesButton onClick={() => onToggleReplies(comment.id)}>
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
