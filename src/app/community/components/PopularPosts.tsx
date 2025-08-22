import React from 'react';
import styled from 'styled-components';
import HtmlContent from '@/components/HtmlContent';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { HotPostItem } from '@/types/post';

interface PopularPostsProps {
  posts: HotPostItem[];
}

const PopularPostsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PopularPostContainer = styled.div`
  padding: ${props => props.theme.spacing.md} 0;
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGray};
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const PopularTag = styled.span`
  background-color: #ff5252;
  color: white;
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

const ContentText = styled.p`
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

const PopularPosts: React.FC<PopularPostsProps> = ({ posts }) => {
  const router = useRouter();
  const handleClick = (post: HotPostItem) => {
    const type = '일반';
    router.push(`${ROUTES.community.post(String(post.id))}?type=${type}`);
  };

  return (
    <PopularPostsWrapper>
      {posts.map(post => {
        const titleText = post.title;
        const authorName = post.author?.nickname ?? '';
        const createdAt = post.createdAt;
        const views = post.viewCount ?? 0;
        return (
          <PopularPostContainer key={post.id} onClick={() => handleClick(post)}>
            <PostHeader>
              <PopularTag>인기글</PopularTag>
              <PostTitle>{titleText}</PostTitle>
            </PostHeader>

            <ContentText>
              <HtmlContent content={post.content} />
            </ContentText>

            <PostFooter>
              <AuthorName>{authorName}</AuthorName>
              <span>•</span>
              <PostDate>{createdAt}</PostDate>
              <span>•</span>
              <ViewCount>조회 {views}</ViewCount>
            </PostFooter>
          </PopularPostContainer>
        );
      })}
    </PopularPostsWrapper>
  );
};

export default PopularPosts;
