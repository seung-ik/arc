'use client';

import styled from 'styled-components';

import CategoryTabs from './CategoryTabs';
import CommunityPost from './CommunityPost';
import MatchPostCard from './MatchPostCard';
import BusinessBanner from './BusinessBanner';
import CommunityLayout from './CommunityLayout';
import { GeneralPost, MatchPost } from '@/types/post';
import PopularPosts from './PopularPosts';
import LoadMoreButton from '@/components/LoadMoreButton';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.base};
`;

interface PopularPost {
  id: number;
  title: string;
  author: string;
  views: number;
  likes: number;
  commentCount: number;
  date: string;
  content: string;
}

interface CommunityPageWrapperProps {
  currentTab: string;
  popularPosts: PopularPost[];
  posts: any[];
  isLoading?: boolean;
  hasNext?: boolean;
  onLoadMore?: () => void;
  showLoadMore?: boolean;
}

export default function CommunityPageWrapper({
  currentTab,
  popularPosts,
  posts,
  isLoading = false,
  hasNext = false,
  onLoadMore,
  showLoadMore = true,
}: CommunityPageWrapperProps) {
  const handleAdClick = (business: any) => {
    console.log('업장 배너 클릭됨:', business.name);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Container>
      <CategoryTabs currentLabel={currentTab} />
      <CommunityLayout>
        <Content>
          <PopularPosts posts={popularPosts} />
          <BusinessBanner onClick={handleAdClick} />
          <PostList>
            {posts && posts.length > 0 ? (
              posts.map((post: any) => {
                if (post.type === '매치') {
                  return (
                    <MatchPostCard
                      key={post.id}
                      post={post as unknown as MatchPost}
                    />
                  );
                }
                if (post.type === '일반') {
                  return (
                    <CommunityPost
                      key={post.id}
                      post={post as unknown as GeneralPost}
                    />
                  );
                }
                return (
                  <CommunityPost key={post.id} post={post as GeneralPost} />
                );
              })
            ) : (
              <NoResults>게시글이 없습니다.</NoResults>
            )}
          </PostList>
          {showLoadMore && hasNext && onLoadMore && (
            <LoadMoreButton onClick={onLoadMore} isLoading={isLoading}>
              더보기
            </LoadMoreButton>
          )}
        </Content>
      </CommunityLayout>
    </Container>
  );
}
