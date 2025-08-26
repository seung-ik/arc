'use client';

import { useCommunityStore } from '@/stores/communityStore';
import { useInfinitePagination } from '@/hooks/useInfinitePagination';
import CommunityPageWrapper from '../components/CommunityPageWrapper';
import { usePostsApi, useStoredHotPostsApi } from '@/api/useCommunity';
import { useMemo } from 'react';

export default function CommunityPage() {
  const currentTab = '자유글';

  const { communityTabs } = useCommunityStore();
  const categoryId = communityTabs?.[currentTab]?.id || 1;
  const { fetchPosts } = usePostsApi(categoryId, 1, 10);
  const { data: hotPosts } = useStoredHotPostsApi();

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
