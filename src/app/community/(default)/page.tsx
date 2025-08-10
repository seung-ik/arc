'use client';

import { usePostsApi } from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';
import CommunityPageWrapper from '../components/CommunityPageWrapper';

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

  const handleLoadMore = () => {};

  return (
    <CommunityPageWrapper
      currentTab={currentTab}
      popularPosts={popularFreePosts}
      postsData={postsData}
      onLoadMore={handleLoadMore}
    />
  );
}
