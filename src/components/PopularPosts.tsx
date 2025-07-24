import React from 'react';
import styled from 'styled-components';

interface Post {
  id: number;
  title: string;
  author: string;
  views: number;
  likes: number;
  commentCount: number;
}

interface PopularPostsProps {
  posts: Post[];
}

const PopularPostsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
`;

const PopularPostCard = styled.div`
  background: #e6f0fa;
  border-radius: 12px;
  padding: 10px 16px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  height: 38px;
`;

const TagAndTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
`;

const LeftGroup = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
`;

const Badge = styled.span`
  background: #ff5252;
  color: white;
  font-weight: 700;
  font-size: 12px;
  border-radius: 8px;
  padding: 2px 8px;
  letter-spacing: 1px;
  display: inline-block;
  white-space: nowrap;
  flex-shrink: 0;
`;

const Title = styled.span`
  color: #d32f2f;
  font-weight: 700;
  font-size: 16px;
  word-break: break-all;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 40vw;
`;

const Comment = styled.span`
  color: #888;
  font-size: 14px;
  margin-left: 2px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const Author = styled.span`
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  flex-shrink: 0;
`;

const PopularPosts: React.FC<PopularPostsProps> = ({ posts }) => {
  return (
    <PopularPostsWrapper>
      {posts.map(post => (
        <PopularPostCard key={post.id}>
          <TagAndTitle>
            <LeftGroup>
              <Badge>인기글</Badge>
              <Title>{post.title}</Title>
              <Comment>
                ({typeof post.commentCount === 'number' ? post.commentCount : 0}
                )
              </Comment>
            </LeftGroup>
            <Author>by {post.author}</Author>
          </TagAndTitle>
        </PopularPostCard>
      ))}
    </PopularPostsWrapper>
  );
};

export default PopularPosts;
