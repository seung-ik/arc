'use client';

import { useCommunityStore } from '@/stores/communityStore';
import { useInfinitePagination } from '@/hooks/useInfinitePagination';
import CommunityPageWrapper from '../components/CommunityPageWrapper';
import { usePostsApi } from '@/api/useCommunity';

// 인기글(3개만)
const popularFreePosts = [
  {
    id: 1,
    title: '체스 오프닝 가이드',
    author: '체스마스터',
    views: 345,
    likes: 89,
    commentCount: 34,
    date: '2024-01-15',
    content:
      '체스 초보자를 위한 기본 오프닝들을 정리했습니다. 이탈리안 게임, 루이 로페즈, 스코치 게임 등 자주 사용되는 오프닝들을 단계별로 설명합니다.',
  },
  {
    id: 2,
    title: '체스 엔드게임 전략',
    author: '체스고수',
    views: 234,
    likes: 67,
    commentCount: 28,
    date: '2024-01-13',
    content:
      '체스 엔드게임에서 승리를 위한 전략을 공유합니다. 킹과 폰만 남은 상황에서의 승리 방법을 자세히 설명합니다.',
  },
  {
    id: 3,
    title: '체스 대회 후기',
    author: '체스선수',
    views: 189,
    likes: 45,
    commentCount: 23,
    date: '2024-01-11',
    content:
      '지난 주에 참가한 체스 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
  },
];

export default function ChessPage() {
  const currentTab = '체스';

  const { communityTabs } = useCommunityStore();
  const categoryId = communityTabs?.[currentTab]?.id || 0;

  // usePostsApi를 사용하여 fetchPosts 함수 가져오기
  const { fetchPosts } = usePostsApi(categoryId, 1, 10);

  // useInfinitePagination 훅 사용
  const {
    items: posts,
    isLoading,
    hasNext,
    loadMore,
  } = useInfinitePagination({
    fetchFunction: async (page: number, limit: number) => {
      // usePostsApi의 fetchPosts를 사용하여 페이지네이션 처리
      const response = await fetchPosts(page, limit);

      return {
        data: response.data,
        pagination: response.pagination,
      };
    },
    pageSize: 10,
    dependencies: [categoryId],
  });

  return (
    <CommunityPageWrapper
      currentTab={currentTab}
      popularPosts={popularFreePosts}
      posts={posts}
      isLoading={isLoading}
      hasNext={hasNext}
      onLoadMore={loadMore}
    />
  );
}
