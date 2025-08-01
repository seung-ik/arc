'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { GeneralPost } from '@/types/post';
import HtmlContent from '@/components/HtmlContent';

interface CommunityPostProps {
  post: GeneralPost;
  onClick?: (postId: number) => void;
}

const PostContainer = styled.div`
  padding: ${props => props.theme.spacing.md} 0;
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  border-top: 1px solid ${props => props.theme.colors.borderLight};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGray};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const CategoryTag = styled.span<{ $type: string }>`
  background-color: ${props => {
    switch (props.$type) {
      case '일반':
        return props.theme.colors.postType.general.background;
      case '매치':
        return props.theme.colors.postType.match.background;
      case '멘토':
        return props.theme.colors.postType.mentor.background;
      default:
        return props.theme.colors.backgroundGray;
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case '일반':
        return props.theme.colors.postType.general.text;
      case '매치':
        return props.theme.colors.postType.match.text;
      case '멘토':
        return props.theme.colors.postType.mentor.text;
      default:
        return props.theme.colors.textGray;
    }
  }};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  flex-shrink: 0;
`;

const PostTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  margin: 0;
  line-height: 1.4;
`;

const ContentText = styled.div`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  line-height: 1.4;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textLightGray};
`;

const AuthorName = styled.span`
  color: ${props => props.theme.colors.textGray};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const PostDate = styled.span`
  color: ${props => props.theme.colors.textLightGray};
`;

const ViewCount = styled.span`
  color: ${props => props.theme.colors.textLightGray};
`;

export default function CommunityPost({ post, onClick }: CommunityPostProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(post.id);
    } else {
      router.push(
        `${ROUTES.community.post(post.id.toString())}?type=${post.type || '일반'}`
      );
    }
  };

  // 제목에 댓글수 포함
  const titleWithComments =
    post.commentCount && post.commentCount > 0
      ? `${post.title} (${post.commentCount})`
      : post.title;

  return (
    <PostContainer onClick={handleClick}>
      <PostHeader>
        <CategoryTag $type={post.type}>{post.type}</CategoryTag>
        <PostTitle>{titleWithComments}</PostTitle>
      </PostHeader>

      <ContentText>
        <HtmlContent content={post.content} />
      </ContentText>

      <PostFooter>
        <AuthorName>{post.author.nickname}</AuthorName>
        <span>•</span>
        <PostDate>{post.createdAt}</PostDate>
        <span>•</span>
        <ViewCount>조회 {post.viewCount || 0}</ViewCount>
      </PostFooter>
    </PostContainer>
  );
}
