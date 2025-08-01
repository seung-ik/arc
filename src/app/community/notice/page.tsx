'use client';

import { usePostsApi } from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';
import CommunityPageWrapper from '../component/CommunityPageWrapper';

export default function NoticePage() {
  const currentTab = '공지사항';

  const { communityTabs } = useCommunityStore();
  const categoryId = communityTabs?.[currentTab]?.id || 0;
  const { data: postsData } = usePostsApi(categoryId);

  const handleLoadMore = () => {};

  return (
    <CommunityPageWrapper
      currentTab={currentTab}
      popularPosts={[]}
      postsData={postsData}
      onLoadMore={handleLoadMore}
    />
  );
}
