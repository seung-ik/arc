'use client';

import styled from 'styled-components';

import CategoryTabs from './CategoryTabs';
import CommunityPost from './CommunityPost';
import MatchPostCard from './MatchPostCard';
import BusinessBanner from './BusinessBanner';
import CommunityLayout from './CommunityLayout';
import { GeneralPost, MatchPost } from '@/types/post';
import PopularPosts from './PopularPosts';

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
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.base};
`;

const LoadMoreButton = styled.button`
  background-color: ${props => props.theme.colors.backgroundGray};
  color: ${props => props.theme.colors.textBlack};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.textGray};
  cursor: pointer;
  margin: ${props => props.theme.spacing.md} auto;
  display: block;
  width: 80%;
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.borderLight};
    border-color: ${props => props.theme.colors.textBlack};
  }
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
  postsData: any;
  onLoadMore?: () => void;
  showLoadMore?: boolean;
}

export default function CommunityPageWrapper({
  currentTab,
  popularPosts,
  postsData,
  onLoadMore,
  showLoadMore = true,
}: CommunityPageWrapperProps) {
  const handleAdClick = (business: any) => {
    console.log('업장 배너 클릭됨:', business.name);
    // 실제로는 업장 상세 페이지로 이동하거나 모달을 열 수 있음
  };

  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore();
    } else {
      console.log('더보기 클릭됨');
    }
  };

  return (
    <Container>
      <CategoryTabs currentLabel={currentTab} />
      <CommunityLayout>
        <Content>
          <PopularPosts posts={popularPosts} />
          <BusinessBanner onClick={handleAdClick} />
          <PostList>
            {postsData?.data && postsData?.data.length > 0 ? (
              postsData?.data.map((post: any) => {
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
          {showLoadMore && (
            <LoadMoreButton onClick={handleLoadMore}>더보기</LoadMoreButton>
          )}
        </Content>
      </CommunityLayout>
    </Container>
  );
}
