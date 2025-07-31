'use client';

import styled from 'styled-components';

import CategoryTabs from '@/components/CategoryTabs';
import CommunityPost from '@/components/CommunityPost';
import MatchPostCard from '@/components/MatchPostCard';
import BusinessBanner from '@/components/BusinessBanner';
import CommunityLayout from '@/components/CommunityLayout';
import { GeneralPost, MatchPost } from '@/types/post';
import PopularPosts from '@/components/PopularPosts';
import { usePostsApi } from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';

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

// 인기글(3개만)
const popularFreePosts = [
  {
    id: 1,
    title: '테니스 라켓 구매 후기',
    author: '테니스매니아',
    views: 89,
    likes: 15,
    commentCount: 31,
    date: '2024-01-15',
    content:
      '최근에 Wilson Pro Staff RF97을 구매했습니다. 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다.',
  },
  {
    id: 2,
    title: '당구 실력 향상 팁 공유',
    author: '당구마스터',
    views: 234,
    likes: 67,
    commentCount: 45,
    date: '2024-01-13',
    content:
      '당구를 시작한 지 2년이 되었는데, 실력 향상에 도움이 되었던 팁들을 공유합니다. 기본 자세와 그립이 가장 중요하고, 연습할 때는 꾸준함이 핵심입니다.',
  },
  {
    id: 3,
    title: '체스 전략 가이드',
    author: '체스마스터',
    views: 345,
    likes: 89,
    commentCount: 34,
    date: '2024-01-11',
    content:
      '체스 초보자를 위한 기본 전략을 정리해보았습니다. 오프닝, 미들게임, 엔드게임 각 단계별로 중요한 포인트들을 설명합니다.',
  },
];

export default function CommunityPage() {
  const currentTab = '자유글';

  const { communityTabs } = useCommunityStore();
  const categoryId = communityTabs?.[currentTab]?.id || 0;
  const { data: postsData } = usePostsApi(categoryId);

  console.log(postsData);

  const handleAdClick = (business: any) => {
    console.log('업장 배너 클릭됨:', business.name);
    // 실제로는 업장 상세 페이지로 이동하거나 모달을 열 수 있음
  };

  const handleLoadMore = () => {
    console.log('더보기 클릭됨');
  };

  return (
    <Container>
      <CategoryTabs currentLabel={currentTab} />
      <CommunityLayout>
        <Content>
          <PopularPosts posts={popularFreePosts} />
          <BusinessBanner onClick={handleAdClick} />
          <PostList>
            {postsData?.data && postsData?.data.length > 0 ? (
              postsData?.data.map(post => {
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
          {/* {hasMorePosts && (
            <LoadMoreButton onClick={handleLoadMore}>더보기</LoadMoreButton>
          )} */}
          {true && (
            <LoadMoreButton onClick={handleLoadMore}>더보기</LoadMoreButton>
          )}
        </Content>
      </CommunityLayout>
    </Container>
  );
}
