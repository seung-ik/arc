'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

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
  commentCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  // 매치 포스트 전용 필드
  matchLocation?: string;
  myElo?: string;
  preferredElo?: string;
  validityPeriod?: string;
  // 멘토 포스트 전용 필드
  sport?: string;
  customSport?: string;
  elo?: string;
  location?: string;
  tokenReward?: string;
}

interface CommunityPostProps {
  post: Post;
}

const PostCard = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const PostTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: 0;
  flex: 1;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const CategoryBadge = styled.span<{ $type: string }>`
  background-color: ${(props) => {
    switch (props.$type) {
      case '일반':
        return props.theme.colors.postType.general.background;
      case '매치':
        return props.theme.colors.postType.match.background;
      case '멘토':
        return props.theme.colors.postType.mentor.background;
      default:
        return props.theme.colors.postType.general.background;
    }
  }};
  color: ${(props) => {
    switch (props.$type) {
      case '일반':
        return props.theme.colors.postType.general.text;
      case '매치':
        return props.theme.colors.postType.match.text;
      case '멘토':
        return props.theme.colors.postType.mentor.text;
      default:
        return props.theme.colors.postType.general.text;
    }
  }};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  margin-left: ${(props) => props.theme.spacing.sm};
  flex-shrink: 0;
`;

const PostContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing.md};
`;

const ContentText = styled.p`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin: 0;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const PostFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${(props) => props.theme.spacing.xs};
  flex-shrink: 0;
  min-width: 180px;
`;

const AuthorId = styled.button`
  color: ${(props) => props.theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  text-decoration: underline;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primaryHover};
  }
`;

const PostDate = styled.span`
  color: ${(props) => props.theme.colors.textLightGray};
`;

const DateAuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  color: ${(props) => props.theme.colors.textLightGray};
`;

const MatchInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-top: ${(props) => props.theme.spacing.xs};
`;

const EloBadge = styled.span`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const LocationBadge = styled.span`
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const SkillLevelBadge = styled.span`
  background-color: ${(props) => props.theme.colors.success};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

export default function CommunityPost({ post }: CommunityPostProps) {
  const router = useRouter();

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 게시글 클릭 이벤트와 충돌 방지
    router.push(`${ROUTES.profile.user(post.authorId)}`);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 게시글 클릭 이벤트와 충돌 방지
    router.push(`${ROUTES.community.post(post.id.toString())}`);
  };

  const handlePostClick = () => {
    // 게시글 상세 페이지로 이동
    router.push(`${ROUTES.community.post(post.id.toString())}`);
  };

  return (
    <PostCard onClick={handlePostClick}>
      <PostHeader>
        <PostTitle onClick={handleTitleClick}>{post.title}</PostTitle>
        <CategoryBadge $type={post.postType}>{post.postType}</CategoryBadge>
      </PostHeader>

      <PostContent>
        <ContentText>{post.content}</ContentText>
        <PostFooter>
          <DateAuthorInfo>
            <PostDate>{post.date}</PostDate>
            <span>•</span>
            <AuthorId onClick={handleAuthorClick}>{post.authorName}</AuthorId>
          </DateAuthorInfo>
          {post.postType === '매치' && post.myElo && post.matchLocation && (
            <MatchInfo>
              <EloBadge>ELO {post.myElo}</EloBadge>
              <LocationBadge>{post.matchLocation}</LocationBadge>
            </MatchInfo>
          )}
        </PostFooter>
      </PostContent>
    </PostCard>
  );
}
