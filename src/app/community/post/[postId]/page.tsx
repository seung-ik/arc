'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityLayout from '@/components/CommunityLayout';
import { ROUTES } from '@/constants/routes';

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
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md} 0;
  border-top: 1px solid ${(props) => props.theme.colors.border};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.textBlack};
  }

  &.liked {
    color: #e74c3c;
  }
`;

const ViewCount = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textGray};
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
  background-color: ${(props) => props.theme.colors.background};
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textGray};
`;

const CommentDate = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textGray};
`;

const CommentAuthor = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textGray};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const CommentContent = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  line-height: 1.6;
  color: ${(props) => props.theme.colors.textBlack};
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const CommentActions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  justify-content: flex-end;
`;

const CommentLikeButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};

  &:hover {
    color: ${(props) => props.theme.colors.textBlack};
  }

  &.liked {
    color: #e74c3c;
  }
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const ToggleRepliesButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  margin-top: ${(props) => props.theme.spacing.sm};

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const RepliesContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing.lg};
  padding-left: ${(props) => props.theme.spacing.lg};
`;

const ReplyForm = styled.div`
  margin-top: ${(props) => props.theme.spacing.sm};
  padding-left: ${(props) => props.theme.spacing.lg};
  position: relative;
`;

const ReplyTextarea = styled.textarea`
  width: 100%;
  padding: ${(props) => props.theme.spacing.sm};
  padding-right: 60px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  background-color: ${(props) => props.theme.colors.background};
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

const ReplySubmitButton = styled.button`
  position: absolute;
  top: ${(props) => props.theme.spacing.xs};
  right: ${(props) => props.theme.spacing.xs};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.textWhite};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  padding: 2px 8px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 40px;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const ReplyCancelButton = styled.button`
  position: absolute;
  top: ${(props) => props.theme.spacing.xs};
  right: 50px;
  background-color: ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.textGray};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  padding: 2px 8px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 40px;

  &:hover {
    background-color: ${(props) => props.theme.colors.textLightGray};
  }
`;

const ReplyItem = styled.div`
  padding: ${(props) => props.theme.spacing.sm};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background-color: ${(props) => props.theme.colors.background};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const ReplyContent = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  line-height: 1.4;
  color: ${(props) => props.theme.colors.textBlack};
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const ReplyFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.xs};
`;

const ReplyMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  color: ${(props) => props.theme.colors.textGray};
`;

const ReplyDate = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  color: ${(props) => props.theme.colors.textGray};
`;

const ReplyAuthor = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textGray};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.textGray};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  text-align: center;
`;

const ErrorMessage = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.textGray};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const BackButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.textWhite};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.lg};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
  }
`;

// 임시 데이터 타입
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
  commentCount: number;
  isLiked: boolean;
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

// 임시 데이터
const mockPost: Post = {
  id: 1,
  title: '테니스 라켓 구매 후기',
  content: `최근에 Wilson Pro Staff RF97을 구매했습니다. 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다.

특히 서브와 포핸드에서 위력이 대단합니다. 라켓 헤드가 작아서 정확도가 높고, 무게감이 있어서 파워도 충분합니다.

다만 초보자에게는 조금 어려울 수 있어요. 적어도 1년 이상 테니스를 치신 분들에게 추천드립니다.

스트링은 Luxilon Alu Power를 사용했는데, 이것도 정말 좋네요. 스핀과 컨트롤이 완벽하게 조화를 이룹니다.

전체적으로 만족도가 높은 구매였습니다!`,
  authorId: 'user303',
  authorName: '테니스매니아',
  date: '2024-01-15',
  category: 'tennis',
  postType: '후기',
  viewCount: 89,
  likeCount: 31,
  commentCount: 8,
  isLiked: false,
};

// 카테고리 한글 이름 매핑
const CATEGORY_LABELS: { [key: string]: string } = {
  tennis: '테니스',
  badminton: '배드민턴',
  'table-tennis': '탁구',
  billiards: '당구',
  go: '바둑',
  chess: '체스',
};

const mockComments: Comment[] = [
  {
    id: 1,
    authorId: 'user456',
    authorName: '테니스러버',
    content: '정말 좋은 후기네요! 저도 같은 라켓을 사용하고 있는데 정말 만족합니다.',
    date: '2024-01-15',
    likeCount: 5,
    isLiked: false,
    replies: [
      {
        id: 101,
        authorId: 'user303',
        authorName: '테니스매니아',
        content: '감사합니다! 혹시 스트링은 어떤 걸 사용하시나요?',
        date: '2024-01-15',
        parentId: 1,
        likeCount: 0,
        isLiked: false,
      },
      {
        id: 102,
        authorId: 'user456',
        authorName: '테니스러버',
        content: '저는 Luxilon Alu Power를 사용하고 있어요. 정말 좋습니다!',
        date: '2024-01-15',
        parentId: 1,
        likeCount: 0,
        isLiked: false,
      },
    ],
  },
  {
    id: 2,
    authorId: 'user789',
    authorName: '테니스초보',
    content: '초보자인데 이 라켓 괜찮을까요?',
    date: '2024-01-15',
    likeCount: 2,
    isLiked: false,
  },
  {
    id: 3,
    authorId: 'user303',
    authorName: '테니스매니아',
    content:
      '초보자분께는 조금 어려울 수 있어요. 먼저 기본기를 다지신 후에 고려해보시는 것을 추천드립니다!',
    date: '2024-01-15',
    likeCount: 1,
    isLiked: false,
  },
];

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        setPost(mockPost);
        setComments(mockComments);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = () => {
    if (!post) return;

    setPost((prev) =>
      prev
        ? {
            ...prev,
            isLiked: !prev.isLiked,
            likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
          }
        : null,
    );
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !post) return;

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

    setPost((prev) => (prev ? { ...prev, commentCount: prev.commentCount + 1 } : null));
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
    if (!replyContent.trim() || !post) return;

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

    setPost((prev) => (prev ? { ...prev, commentCount: prev.commentCount + 1 } : null));
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
    router.push(`${ROUTES.profile.user(authorId)}`);
  };

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container>
        <CategoryTabs />
        <CommunityLayout>
          <LoadingContainer>로딩 중...</LoadingContainer>
        </CommunityLayout>
        <BottomNavigation />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <CategoryTabs />
        <CommunityLayout>
          <ErrorContainer>
            <ErrorMessage>{error || '게시글을 찾을 수 없습니다.'}</ErrorMessage>
            <BackButton onClick={handleBackClick}>돌아가기</BackButton>
          </ErrorContainer>
        </CommunityLayout>
        <BottomNavigation />
      </Container>
    );
  }

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <Content>
          <PostHeader>
            <PostTitle>{post.title}</PostTitle>
            <PostMeta>
              <AuthorInfo>
                <AuthorName onClick={() => handleAuthorClick(post.authorId)}>
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
              <ActionButton onClick={handleLike} className={post.isLiked ? 'liked' : ''}>
                <span>❤️</span>
                <span>{post.likeCount}</span>
              </ActionButton>
              <ActionButton>
                <span>💬</span>
                <span>{post.commentCount}</span>
              </ActionButton>
            </ActionButtons>
            <ViewCount>조회 {post.viewCount}</ViewCount>
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
      </CommunityLayout>
      <BottomNavigation />
    </Container>
  );
}
