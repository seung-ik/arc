'use client';

import { usePostsApi } from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';
import CommunityPageWrapper from '../component/CommunityPageWrapper';
import { createPopularPostsByViewsFromMock } from '../utils/mockData';

// 당구 관련 임시 게시글 데이터
const mockPosts = [
  // 일반 포스트
  {
    id: 1,
    title: '당구 실력 향상 팁',
    content:
      '당구를 시작한 지 3개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 큐 각도 잡는 법과 파워 조절에 어려움을 겪고 있어요. 고수분들의 조언 부탁드립니다!',
    authorId: 'user202',
    authorName: '당구초보',
    date: '2024-01-15',
    postType: '일반',
    category: '당구',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 2,
    title: '당구 동호회 모집',
    content:
      '서울 강북 지역에서 당구를 치는 동호회를 만들려고 합니다. 실력에 관계없이 즐겁게 치실 분들 모집합니다. 매주 토요일 오후에 모입니다.',
    authorId: 'user456',
    authorName: '당구마스터',
    date: '2024-01-14',
    postType: '일반',
    category: '당구',
    viewCount: 34,
    commentCount: 12,
  },
  {
    id: 3,
    title: '당구 큐 구매 후기',
    content:
      'Predator Ikon4-3를 구매했습니다. 카본 큐라 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 큐라는 걸 알 수 있었습니다.',
    authorId: 'user789',
    authorName: '당구매니아',
    date: '2024-01-13',
    postType: '일반',
    category: '당구',
    viewCount: 52,
    commentCount: 18,
  },
  {
    id: 4,
    title: '당구장 추천',
    content:
      '서울 강남 지역에서 당구를 칠 수 있는 좋은 당구장을 찾고 있습니다. 시설이 깨끗하고 가격이 합리적인 곳을 추천해주세요.',
    authorId: 'user101',
    authorName: '당구러버',
    date: '2024-01-12',
    postType: '일반',
    category: '당구',
    viewCount: 45,
    commentCount: 16,
  },
  {
    id: 5,
    title: '당구 기술 분석',
    content:
      '프로 선수들의 당구 기술을 분석해보았습니다. 각 선수별 특징과 배울 점을 정리해봤어요.',
    authorId: 'user303',
    authorName: '당구고수',
    date: '2024-01-11',
    postType: '일반',
    category: '당구',
    viewCount: 78,
    commentCount: 31,
  },
  {
    id: 6,
    title: '당구 대회 후기',
    content:
      '지난 주에 참가한 당구 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
    authorId: 'user404',
    authorName: '당구선수',
    date: '2024-01-10',
    postType: '일반',
    category: '당구',
    viewCount: 92,
    commentCount: 34,
  },
  {
    id: 7,
    title: '당구 큐 관리법',
    content:
      '당구 큐를 오래 사용하려면 어떻게 관리해야 하는지 궁금합니다. 현재 사용 중인 큐가 6개월 정도 되었는데 관리법을 알려주세요.',
    authorId: 'user505',
    authorName: '당구초보',
    date: '2024-01-09',
    postType: '일반',
    category: '당구',
    viewCount: 43,
    commentCount: 12,
  },
  {
    id: 8,
    title: '당구장 예약 팁',
    content:
      '서울 지역 당구장 예약에 대한 팁을 공유합니다. 평일 오전이 가장 예약하기 쉽고, 주말은 일주일 전에 예약해야 합니다.',
    authorId: 'user606',
    authorName: '당구러버',
    date: '2024-01-08',
    postType: '일반',
    category: '당구',
    viewCount: 156,
    commentCount: 47,
  },
  {
    id: 9,
    title: '당구 스트로크 개선',
    content:
      '스트로크를 개선하고 싶습니다. 현재 스트로크가 불안정해서 실수하는 경우가 많아요. 연습 방법을 알려주세요.',
    authorId: 'user707',
    authorName: '당구매니아',
    date: '2024-01-07',
    postType: '일반',
    category: '당구',
    viewCount: 67,
    commentCount: 21,
  },
  {
    id: 10,
    title: '당구 용품 추천',
    content:
      '당구 초보자를 위한 필수 용품을 추천해드립니다. 큐, 크레용, 가방, 장갑 등 기본적인 것부터 시작하시면 됩니다.',
    authorId: 'user808',
    authorName: '당구마스터',
    date: '2024-01-06',
    postType: '일반',
    category: '당구',
    viewCount: 134,
    commentCount: 38,
  },
  {
    id: 11,
    title: '당구 동호회 후기',
    content:
      '지난 달에 가입한 당구 동호회 후기를 공유합니다. 정말 좋은 분들과 함께해서 실력도 향상되고 즐거운 시간을 보내고 있어요.',
    authorId: 'user909',
    authorName: '당구러버',
    date: '2024-01-05',
    postType: '일반',
    category: '당구',
    viewCount: 89,
    commentCount: 26,
  },
  {
    id: 12,
    title: '당구 대회 정보',
    content:
      '올해 상반기 당구 대회 일정을 정리해드립니다. 각 대회별 참가 조건과 상금 정보도 포함되어 있습니다.',
    authorId: 'user111',
    authorName: '당구선수',
    date: '2024-01-04',
    postType: '일반',
    category: '당구',
    viewCount: 201,
    commentCount: 52,
  },
  // 매치 포스트
  {
    id: 13,
    title: '당구 매치 상대 구합니다',
    content:
      '서울 강남 지역에서 당구 매치 상대를 구합니다. 실력은 중급 정도이고, 매주 토요일 오후에 치고 싶습니다. 연락처 남겨주세요!',
    authorId: 'user222',
    authorName: '당구매처',
    date: '2024-01-24',
    postType: '매치',
    category: '당구',
    matchLocation: '서울 강남구 당구장',
    myElo: '1450',
    preferredElo: 'similar',
    validityPeriod: '7',
    viewCount: 34,
    commentCount: 12,
  },
  {
    id: 14,
    title: '당구 친선 경기 상대',
    content:
      '부산 해운대 지역에서 당구 친선 경기 상대를 구합니다. 실력에 관계없이 즐겁게 치실 분 환영합니다!',
    authorId: 'user333',
    authorName: '부산당구',
    date: '2024-01-21',
    postType: '매치',
    category: '당구',
    matchLocation: '부산 해운대구 당구장',
    myElo: '1320',
    preferredElo: 'any',
    validityPeriod: '3',
    viewCount: 28,
    commentCount: 8,
  },
  {
    id: 15,
    title: '당구 연습 상대 구합니다',
    content:
      '대구 수성구에서 당구 연습 상대를 구합니다. 초급 실력이고, 실력 향상이 목표입니다. 매주 일요일 오전에 치고 싶습니다.',
    authorId: 'user444',
    authorName: '대구당구',
    date: '2024-01-19',
    postType: '매치',
    category: '당구',
    matchLocation: '대구 수성구 당구장',
    myElo: '1180',
    preferredElo: 'similar',
    validityPeriod: '1',
    viewCount: 22,
    commentCount: 6,
  },
  {
    id: 16,
    title: '당구 토너먼트 참가자 모집',
    content:
      '인천 연수구에서 당구 토너먼트를 개최하려고 합니다. 참가자 16명을 모집합니다. 실력은 중급 이상이어야 합니다.',
    authorId: 'user555',
    authorName: '인천당구',
    date: '2024-01-17',
    postType: '매치',
    category: '당구',
    matchLocation: '인천 연수구 당구장',
    myElo: '1520',
    preferredElo: 'higher',
    validityPeriod: '5',
    viewCount: 45,
    commentCount: 15,
  },
  // 멘토 포스트
  {
    id: 17,
    title: '당구 레슨 제공합니다',
    content:
      '당구 레슨을 제공합니다. 10년 경력의 당구 지도자입니다. 초급부터 중급까지 체계적으로 가르쳐드립니다. 서울 강남 지역에서 가능합니다.',
    authorId: 'user666',
    authorName: '당구코치',
    date: '2024-01-15',
    postType: '멘토',
    category: '당구',
    location: '서울 강남',
    skillLevel: '초급~중급',
    experience: '10년',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 18,
    title: '당구 기초 레슨',
    content:
      '당구 기초를 가르쳐드립니다. 스트로크, 큐 각도, 파워 조절부터 차근차근 배워보세요. 부산 서구 지역에서 가능합니다.',
    authorId: 'user777',
    authorName: '당구선생',
    date: '2024-01-14',
    postType: '멘토',
    category: '당구',
    location: '부산 서구',
    skillLevel: '초급',
    experience: '5년',
    viewCount: 42,
    commentCount: 18,
  },
  {
    id: 19,
    title: '당구 고급 기술 레슨',
    content:
      '당구 고급 기술을 가르쳐드립니다. 스핀 샷, 뱅크 샷, 각종 기술을 배워보세요. 대구 중구 지역에서 가능합니다.',
    authorId: 'user888',
    authorName: '당구마스터',
    date: '2024-01-13',
    postType: '멘토',
    category: '당구',
    location: '대구 중구',
    skillLevel: '중급~고급',
    experience: '15년',
    viewCount: 38,
    commentCount: 14,
  },
  {
    id: 20,
    title: '당구 개인 레슨',
    content:
      '당구 개인 레슨을 제공합니다. 1:1 맞춤형 레슨으로 빠른 실력 향상을 도와드립니다. 인천 남구 지역에서 가능합니다.',
    authorId: 'user999',
    authorName: '당구개인교습',
    date: '2024-01-12',
    postType: '멘토',
    category: '당구',
    location: '인천 남구',
    skillLevel: '전체',
    experience: '8년',
    viewCount: 31,
    commentCount: 11,
  },
];

export default function BilliardsPage() {
  const currentTab = '당구';

  const { communityTabs } = useCommunityStore();
  const categoryId = communityTabs?.[currentTab]?.id || 0;
  const { data: postsData } = usePostsApi(categoryId);

  console.log(postsData);

  // 인기글(일반글 중 조회수 순 상위 3개)
  const popularFreePosts = createPopularPostsByViewsFromMock(mockPosts, 3);

  const handleLoadMore = () => {
    console.log('당구 더보기 클릭됨');
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
