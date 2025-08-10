'use client';

import { useCommunityStore } from '@/stores/communityStore';
import { useInfinitePagination } from '@/hooks/useInfinitePagination';
import CommunityPageWrapper from '../components/CommunityPageWrapper';
import { usePostsApi } from '@/api/useCommunity';

// 인기글(3개만)
const popularFreePosts = [
  {
    id: 1,
    title: '배드민턴 스매시 기술 공유',
    author: '배드민턴마스터',
    views: 234,
    likes: 67,
    commentCount: 45,
    date: '2024-01-15',
    content:
      '배드민턴 스매시를 연마한 지 2년이 되었는데, 정말 효과적인 연습법을 발견했습니다. 특히 백핸드 스매시에서 파워와 정확도를 동시에 높이는 방법을 공유합니다.',
  },
  {
    id: 2,
    title: '배드민턴 동호회 모집',
    author: '배드민턴러버',
    views: 156,
    likes: 34,
    commentCount: 23,
    date: '2024-01-13',
    content:
      '서울 강남 지역에서 배드민턴을 치는 동호회를 만들려고 합니다. 실력에 관계없이 즐겁게 치실 분들 모집합니다.',
  },
  {
    id: 3,
    title: '배드민턴 라켓 구매 후기',
    author: '배드민턴매니아',
    views: 189,
    likes: 45,
    commentCount: 31,
    date: '2024-01-11',
    content:
      'Yonex Voltric Z-Force II를 구매했습니다. 라이트 헤드라 처음에는 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다.',
  },
];

export default function BadmintonPage() {
  const currentTab = '배드민턴';

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
