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
  viewCount: number;
  commentCount?: number;
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

const CategoryBadge = styled.span`
  background-color: ${(props) => props.theme.colors.primaryLight};
  color: ${(props) => props.theme.colors.primary};
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
        <CategoryBadge>{post.category}</CategoryBadge>
      </PostHeader>

      <PostContent>
        <ContentText>{post.content}</ContentText>
        <PostFooter>
          <DateAuthorInfo>
            <PostDate>{post.date}</PostDate>
            <span>•</span>
            <AuthorId onClick={handleAuthorClick}>{post.authorName}</AuthorId>
          </DateAuthorInfo>
        </PostFooter>
      </PostContent>
    </PostCard>
  );
}
