'use client';

import styled from 'styled-components';

import CategoryTabs from './CategoryTabs';
import CommunityPostCard from './CommunityPost';
import MatchPostCard from './MatchPostCard';
import BusinessBanner from './BusinessBanner';
import CommunityLayout from './CommunityLayout';
import PopularPosts from './PopularPosts';
import LoadMoreButton from '@/components/buttons/LoadMoreButton';
import { GeneralPostData, MatchPostData, StoredHotPost } from '@/types/post';

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

interface CommunityPageWrapperProps {
  currentTab: string;
  popularPosts: StoredHotPost[];
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
                if (post.type === '매치' || post.type === 'match') {
                  return (
                    <MatchPostCard
                      key={post.id}
                      post={post as unknown as MatchPostData}
                    />
                  );
                }
                if (post.type === '일반' || post.type === 'general') {
                  return (
                    <CommunityPostCard
                      key={post.id}
                      post={post as unknown as GeneralPostData}
                    />
                  );
                }
                return (
                  <CommunityPostCard
                    key={post.id}
                    post={post as GeneralPostData}
                  />
                );
              })
            ) : (
              <NoResults>게시글이 없습니다.</NoResults>
            )}
          </PostList>
          {!showLoadMore && hasNext && onLoadMore && (
            <LoadMoreButton onClick={onLoadMore} isLoading={isLoading}>
              더보기
            </LoadMoreButton>
          )}
        </Content>
      </CommunityLayout>
    </Container>
  );
}
