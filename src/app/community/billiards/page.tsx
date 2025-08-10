'use client';

import { useCommunityStore } from '@/stores/communityStore';
import { useInfinitePagination } from '@/hooks/useInfinitePagination';
import CommunityPageWrapper from '../components/CommunityPageWrapper';
import { usePostsApi } from '@/api/useCommunity';

// 인기글(3개만)
const popularFreePosts = [
  {
    id: 1,
    title: '당구 실력 향상 팁',
    author: '당구마스터',
    views: 234,
    likes: 67,
    commentCount: 45,
    date: '2024-01-15',
    content:
      '당구를 시작한 지 3개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 큐 각도 잡는 법과 파워 조절에 어려움을 겪고 있어요.',
  },
  {
    id: 2,
    title: '당구 동호회 모집',
    author: '당구러버',
    views: 156,
    likes: 34,
    commentCount: 23,
    date: '2024-01-13',
    content:
      '서울 강북 지역에서 당구를 치는 동호회를 만들려고 합니다. 실력에 관계없이 즐겁게 치실 분들 모집합니다.',
  },
  {
    id: 3,
    title: '당구 큐 구매 후기',
    author: '당구매니아',
    views: 189,
    likes: 45,
    commentCount: 31,
    date: '2024-01-11',
    content:
      'Predator Ikon4-3를 구매했습니다. 카본 큐라 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 큐라는 걸 알 수 있었습니다.',
  },
];

export default function BilliardsPage() {
  const currentTab = '당구';

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
