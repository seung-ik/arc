'use client';

import styled from 'styled-components';
import { useState, useMemo } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityPost from '@/components/CommunityPost';
import AdBanner from '@/components/AdBanner';
import SearchInput from '@/components/SearchInput';
import Pagination from '@/components/Pagination';
import CommunityLayout from '@/components/CommunityLayout';
import WriteButton from '@/components/WriteButton';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing.xl};
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
`;

// 체스 관련 임시 게시글 데이터
const mockPosts = [
  // 일반 포스트
  {
    id: 1,
    title: '체스 전략 공유',
    content:
      '오늘 상대방과 체스 대결에서 사용한 전략을 공유합니다. 킹스 인디언 어택을 사용했는데, 상대방이 예상보다 잘 막아내서 고전했습니다. 더 나은 전략이 있으시면 조언 부탁드립니다.',
    authorId: 'user456',
    authorName: '체스왕',
    date: '2024-01-15',
    postType: '일반',
    category: '체스',
    viewCount: 32,
    commentCount: 12,
  },
  {
    id: 2,
    title: '체스 동호회 모집',
    content:
      '서울 강남 지역에서 체스를 두는 동호회를 만들려고 합니다. 실력에 관계없이 즐겁게 두실 분들 모집합니다. 매주 일요일 오후에 모입니다.',
    authorId: 'user789',
    authorName: '체스마스터',
    date: '2024-01-14',
    postType: '일반',
    category: '체스',
    viewCount: 28,
    commentCount: 10,
  },
  {
    id: 3,
    title: '체스 실력 향상 팁',
    content:
      '체스를 시작한 지 6개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 중반전에서의 전략적 판단에 어려움을 겪고 있어요.',
    authorId: 'user101',
    authorName: '체스초보',
    date: '2024-01-13',
    postType: '일반',
    category: '체스',
    viewCount: 45,
    commentCount: 16,
  },
  {
    id: 4,
    title: '체스 오프닝 분석',
    content:
      '체스 오프닝에 대한 분석을 정리해보았습니다. 각 오프닝의 장단점과 활용법을 자세히 분석해봤어요.',
    authorId: 'user202',
    authorName: '체스분석가',
    date: '2024-01-12',
    postType: '일반',
    category: '체스',
    viewCount: 78,
    commentCount: 31,
  },
  {
    id: 5,
    title: '체스 대회 후기',
    content:
      '지난 주에 참가한 체스 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
    authorId: 'user303',
    authorName: '체스선수',
    date: '2024-01-11',
    postType: '일반',
    category: '체스',
    viewCount: 92,
    commentCount: 34,
  },
  {
    id: 6,
    title: '체스 용품 추천',
    content:
      '체스 초보자를 위한 필수 용품을 추천해드립니다. 체스판, 체스말, 체스시계 등 기본적인 것부터 시작하시면 됩니다.',
    authorId: 'user404',
    authorName: '체스마스터',
    date: '2024-01-10',
    postType: '일반',
    category: '체스',
    viewCount: 134,
    commentCount: 38,
  },
  {
    id: 7,
    title: '체스 엔드게임 연구',
    content:
      '체스 엔드게임에 대한 연구를 정리해보았습니다. 킹과 폰, 킹과 룩 등 다양한 엔드게임 상황을 분석해봤어요.',
    authorId: 'user505',
    authorName: '체스연구가',
    date: '2024-01-09',
    postType: '일반',
    category: '체스',
    viewCount: 67,
    commentCount: 21,
  },
  {
    id: 8,
    title: '체스 동호회 후기',
    content:
      '지난 달에 가입한 체스 동호회 후기를 공유합니다. 정말 좋은 분들과 함께해서 실력도 향상되고 즐거운 시간을 보내고 있어요.',
    authorId: 'user606',
    authorName: '체스러버',
    date: '2024-01-08',
    postType: '일반',
    category: '체스',
    viewCount: 89,
    commentCount: 26,
  },
  {
    id: 9,
    title: '체스 대회 정보',
    content:
      '올해 상반기 체스 대회 일정을 정리해드립니다. 각 대회별 참가 조건과 상금 정보도 포함되어 있습니다.',
    authorId: 'user707',
    authorName: '체스선수',
    date: '2024-01-07',
    postType: '일반',
    category: '체스',
    viewCount: 201,
    commentCount: 52,
  },
  {
    id: 10,
    title: '체스 기보 관리법',
    content:
      '체스 기보를 체계적으로 관리하는 방법을 공유합니다. 디지털 기보와 아날로그 기보의 장단점을 비교해봤어요.',
    authorId: 'user808',
    authorName: '체스학도',
    date: '2024-01-06',
    postType: '일반',
    category: '체스',
    viewCount: 45,
    commentCount: 16,
  },
  {
    id: 11,
    title: '체스 실력 측정법',
    content:
      '체스 실력을 객관적으로 측정하는 방법에 대해 알아보았습니다. 각 단계별 특징과 향상 방법을 정리해봤어요.',
    authorId: 'user909',
    authorName: '체스마스터',
    date: '2024-01-05',
    postType: '일반',
    category: '체스',
    viewCount: 156,
    commentCount: 47,
  },
  {
    id: 12,
    title: '체스 기보 분석 도구',
    content:
      '체스 기보를 분석할 수 있는 다양한 도구들을 소개합니다. AI 분석, 기보 데이터베이스 등 유용한 도구들을 정리해봤어요.',
    authorId: 'user111',
    authorName: '체스연구가',
    date: '2024-01-04',
    postType: '일반',
    category: '체스',
    viewCount: 167,
    commentCount: 41,
  },
  // 매치 포스트
  {
    id: 13,
    title: '체스 매치 상대 구합니다',
    content:
      '서울 강남 지역에서 체스 매치 상대를 구합니다. 실력은 중급 정도이고, 매주 토요일 오후에 두고 싶습니다. 연락처 남겨주세요!',
    authorId: 'user222',
    authorName: '체스매처',
    date: '2024-01-15',
    postType: '매치',
    category: '체스',
    location: '서울 강남',
    skillLevel: '중급',
    viewCount: 34,
    commentCount: 12,
  },
  {
    id: 14,
    title: '체스 친선 대국 상대',
    content:
      '부산 해운대 지역에서 체스 친선 대국 상대를 구합니다. 실력에 관계없이 즐겁게 두실 분 환영합니다!',
    authorId: 'user333',
    authorName: '부산체스',
    date: '2024-01-14',
    postType: '매치',
    category: '체스',
    location: '부산 해운대',
    skillLevel: '무관',
    viewCount: 28,
    commentCount: 8,
  },
  {
    id: 15,
    title: '체스 연습 상대 구합니다',
    content:
      '대구 수성구에서 체스 연습 상대를 구합니다. 초급 실력이고, 실력 향상이 목표입니다. 매주 일요일 오전에 두고 싶습니다.',
    authorId: 'user444',
    authorName: '대구체스',
    date: '2024-01-13',
    postType: '매치',
    category: '체스',
    location: '대구 수성구',
    skillLevel: '초급',
    viewCount: 22,
    commentCount: 6,
  },
  {
    id: 16,
    title: '체스 토너먼트 참가자 모집',
    content:
      '인천 연수구에서 체스 토너먼트를 개최하려고 합니다. 참가자 16명을 모집합니다. 실력은 중급 이상이어야 합니다.',
    authorId: 'user555',
    authorName: '인천체스',
    date: '2024-01-12',
    postType: '매치',
    category: '체스',
    location: '인천 연수구',
    skillLevel: '중급 이상',
    viewCount: 45,
    commentCount: 15,
  },
  // 멘토 포스트
  {
    id: 17,
    title: '체스 레슨 제공합니다',
    content:
      '체스 레슨을 제공합니다. 10년 경력의 체스 지도자입니다. 초급부터 중급까지 체계적으로 가르쳐드립니다. 서울 강남 지역에서 가능합니다.',
    authorId: 'user666',
    authorName: '체스코치',
    date: '2024-01-15',
    postType: '멘토',
    category: '체스',
    location: '서울 강남',
    skillLevel: '초급~중급',
    experience: '10년',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 18,
    title: '체스 기초 레슨',
    content:
      '체스 기초를 가르쳐드립니다. 기본 규칙, 오프닝, 중반전 전략부터 차근차근 배워보세요. 부산 서구 지역에서 가능합니다.',
    authorId: 'user777',
    authorName: '체스선생',
    date: '2024-01-14',
    postType: '멘토',
    category: '체스',
    location: '부산 서구',
    skillLevel: '초급',
    experience: '5년',
    viewCount: 42,
    commentCount: 18,
  },
  {
    id: 19,
    title: '체스 고급 기술 레슨',
    content:
      '체스 고급 기술을 가르쳐드립니다. 복잡한 오프닝, 정교한 계산, 엔드게임 기술을 배워보세요. 대구 중구 지역에서 가능합니다.',
    authorId: 'user888',
    authorName: '체스마스터',
    date: '2024-01-13',
    postType: '멘토',
    category: '체스',
    location: '대구 중구',
    skillLevel: '중급~고급',
    experience: '15년',
    viewCount: 38,
    commentCount: 14,
  },
  {
    id: 20,
    title: '체스 개인 레슨',
    content:
      '체스 개인 레슨을 제공합니다. 1:1 맞춤형 레슨으로 빠른 실력 향상을 도와드립니다. 인천 남구 지역에서 가능합니다.',
    authorId: 'user999',
    authorName: '체스개인교습',
    date: '2024-01-12',
    postType: '멘토',
    category: '체스',
    location: '인천 남구',
    skillLevel: '전체',
    experience: '8년',
    viewCount: 31,
    commentCount: 11,
  },
];

const POSTS_PER_PAGE = 12;

export default function ChessPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // 검색 필터링
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockPosts;
    }

    const query = searchQuery.toLowerCase();
    return mockPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdClick = () => {
    console.log('체스 광고 배너 클릭됨');
  };

  const handleWriteClick = () => {
    console.log('체스 글쓰기 버튼 클릭됨');
    router.push(`${ROUTES.community.write}?category=chess`);
  };

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <AdBanner
          title="♟️ 체스 대회 참가 신청"
          description="체스 종목 대회에 참가하고 상금을 받아보세요!"
          onClick={handleAdClick}
        />
        <Content>
          <SearchInput onSearch={handleSearch} placeholder="체스 게시글 검색..." />
          <PostList>
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => <CommunityPost key={post.id} post={post} />)
            ) : (
              <NoResults>{searchQuery ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}</NoResults>
            )}
          </PostList>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Content>
      </CommunityLayout>
      <WriteButton onClick={handleWriteClick} />
      <BottomNavigation />
    </Container>
  );
}
