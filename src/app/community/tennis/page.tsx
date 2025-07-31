'use client';

import { usePostsApi } from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';
import CommunityPageWrapper from '../component/CommunityPageWrapper';

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
    title: '테니스 백핸드 개선법',
    author: '테니스고수',
    views: 78,
    likes: 23,
    commentCount: 29,
    date: '2024-01-11',
    content:
      '백핸드가 항상 약점이었는데, 최근에 개선된 방법을 찾았습니다. 양손 백핸드로 바꾸고 연습하니 훨씬 안정적이 되었어요.',
  },
  {
    id: 3,
    title: '테니스 대회 후기',
    author: '테니스선수',
    views: 92,
    likes: 28,
    commentCount: 34,
    date: '2024-01-10',
    content:
      '지난 주에 참가한 테니스 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
  },
];

export default function TennisPage() {
  const currentTab = '테니스';

  const { communityTabs } = useCommunityStore();
  const categoryId = communityTabs?.[currentTab]?.id || 0;
  const { data: postsData } = usePostsApi(categoryId);

  console.log(postsData);

  const handleLoadMore = () => {
    console.log('테니스 더보기 클릭됨');
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
