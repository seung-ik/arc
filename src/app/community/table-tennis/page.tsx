'use client';

import { usePostsApi } from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';
import CommunityPageWrapper from '../component/CommunityPageWrapper';

// 인기글(3개만)
const popularFreePosts = [
  {
    id: 1,
    title: '탁구 동호회 모집합니다!',
    author: '탁구마스터',
    views: 234,
    likes: 67,
    commentCount: 45,
    date: '2024-01-15',
    content:
      '매주 토요일 오후에 탁구를 치는 동호회를 만들려고 합니다. 초보자도 환영하고, 실력 향상을 목표로 하는 분들 모집합니다.',
  },
  {
    id: 2,
    title: '탁구 라켓 구매 후기',
    author: '탁구매니아',
    views: 189,
    likes: 45,
    commentCount: 31,
    date: '2024-01-13',
    content:
      'Butterfly Viscaria를 구매했습니다. 카본 라켓이라 처음에는 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다.',
  },
  {
    id: 3,
    title: '탁구 실력 향상 팁',
    author: '탁구초보',
    views: 156,
    likes: 34,
    commentCount: 23,
    date: '2024-01-11',
    content:
      '탁구를 시작한 지 3개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 서브와 리시브에 어려움을 겪고 있어요.',
  },
];

export default function TableTennisPage() {
  const currentTab = '탁구';

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
