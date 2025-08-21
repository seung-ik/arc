'use client';

import { useCommunityStore } from '@/stores/communityStore';
import { useInfinitePagination } from '@/hooks/useInfinitePagination';
import CommunityPageWrapper from '../components/CommunityPageWrapper';
import { usePostsApi, useHotPostsApi } from '@/api/useCommunity';
import { useMemo } from 'react';

export default function CommunityPage() {
  const currentTab = '자유글';

  const { communityTabs } = useCommunityStore();
  const categoryId = communityTabs?.[currentTab]?.id || 1;
  console.log('categoryId', categoryId);
  const { fetchPosts } = usePostsApi(categoryId, 1, 10);
  const { data: hotPosts } = useHotPostsApi();

  const {
    items: posts,
    isLoading,
    hasNext,
    loadMore,
  } = useInfinitePagination({
    fetchFunction: async (page: number, limit: number) => {
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
    // 1) categoryId 우선 매칭
    const byId = groups.find(group => group.categoryId === categoryId);
    if (byId) return byId.posts;
    // 2) fallback: 탭 이름과 categoryName 매칭
    const byName = groups.find(group => group.categoryName === currentTab);
    return byName?.posts ?? [];
  }, [hotPosts, categoryId, currentTab]);

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
