'use client';

import { useCommunityStore } from '@/stores/communityStore';
import { useInfinitePagination } from '@/hooks/useInfinitePagination';
import CommunityPageWrapper from '../components/CommunityPageWrapper';
import { usePostsApi, useStoredHotPostsApi } from '@/api/useCommunity';
import { useMemo } from 'react';

export default function TableTennisPage() {
  const currentTab = '탁구';

  const { communityTabs } = useCommunityStore();
  const categoryId = communityTabs?.[currentTab]?.id || 0;

  // usePostsApi를 사용하여 fetchPosts 함수 가져오기
  const { fetchPosts } = usePostsApi(categoryId, 1, 10);
  const { data: hotPosts } = useStoredHotPostsApi();

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

  const hotPostsForCurrentTab = useMemo(() => {
    const groups = hotPosts?.data ?? [];
    // const byId = groups.find(group => group.categoryId === categoryId);
    // if (byId) return byId.posts;
    // const byName = groups.find(group => group.categoryName === currentTab);
    // return byName?.posts ?? [];
    return groups;
  }, [hotPosts]);

  return (
    <CommunityPageWrapper
      currentTab={currentTab}
      popularPosts={hotPostsForCurrentTab}
      posts={posts}
      isLoading={isLoading}
      hasNext={hasNext}
      onLoadMore={loadMore}
    />
  );
}
