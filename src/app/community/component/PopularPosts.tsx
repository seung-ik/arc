import React from 'react';
import styled from 'styled-components';

interface Post {
  id: number;
  title: string;
  author: string;
  views: number;
  likes: number;
  commentCount: number;
  date: string;
  content: string;
}

interface PopularPostsProps {
  posts: Post[];
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
  return (
    <PopularPostsWrapper>
      {posts.map(post => {
        // 제목에 댓글수 포함
        const titleWithComments =
          post.commentCount && post.commentCount > 0
            ? `${post.title} (${post.commentCount})`
            : post.title;

        return (
          <PopularPostContainer key={post.id}>
            <PostHeader>
              <PopularTag>인기글</PopularTag>
              <PostTitle>{titleWithComments}</PostTitle>
            </PostHeader>

            <ContentText>{post.content}</ContentText>

            <PostFooter>
              <AuthorName>{post.author}</AuthorName>
              <span>•</span>
              <PostDate>{post.date}</PostDate>
              <span>•</span>
              <ViewCount>조회 {post.views || 0}</ViewCount>
            </PostFooter>
          </PopularPostContainer>
        );
      })}
    </PopularPostsWrapper>
  );
};

export default PopularPosts;
