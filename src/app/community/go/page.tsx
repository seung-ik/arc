'use client';

import { usePostsApi } from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';
import CommunityPageWrapper from '../component/CommunityPageWrapper';

// 인기글(3개만)
const popularFreePosts = [
  {
    id: 1,
    title: '바둑 기초 가이드',
    author: '바둑마스터',
    views: 456,
    likes: 123,
    commentCount: 45,
    date: '2024-01-15',
    content:
      '바둑 초보자를 위한 기본 규칙과 기초 기술을 정리했습니다. 돌 놓는 법부터 기본 정석까지 단계별로 설명합니다.',
  },
  {
    id: 2,
    title: '바둑 정석 공부법',
    author: '바둑고수',
    views: 289,
    likes: 78,
    commentCount: 32,
    date: '2024-01-13',
    content:
      '바둑 정석을 효과적으로 공부하는 방법을 공유합니다. 기본 정석부터 고급 정석까지 체계적으로 학습하는 팁을 알려드립니다.',
  },
  {
    id: 3,
    title: '바둑 대회 후기',
    author: '바둑선수',
    views: 234,
    likes: 56,
    commentCount: 28,
    date: '2024-01-11',
    content:
      '지난 주에 참가한 바둑 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
  },
];

export default function GoPage() {
  const currentTab = '바둑';

  const { communityTabs } = useCommunityStore();
  const categoryId = communityTabs?.[currentTab]?.id || 0;
  const { data: postsData } = usePostsApi(categoryId);

  const handleLoadMore = () => {
    console.log('바둑 더보기 클됨');
  };

  return (
    <CommunityPageWrapper
      currentTab={currentTab}
      popularPosts={popularFreePosts}
      postsData={postsData}
      onLoadMore={handleLoadMore}
    />
  );
}
