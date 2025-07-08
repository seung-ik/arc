'use client';

import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityPost from '@/components/CommunityPost';
import AdBanner from '@/components/AdBanner';

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
  padding: ${(props) => props.theme.spacing.md};
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
`;

// 배드민턴 관련 임시 게시글 데이터
const mockPosts = [
  {
    id: 1,
    title: '배드민턴 라켓 구매 후기',
    content:
      'Yonex Voltric Z-Force II를 구매했습니다. 라이트 헤드 무거운 그립 타입인데, 스매시가 정말 강력합니다. 특히 백핸드 클리어가 훨씬 안정적이에요.',
    authorId: 'user101',
    authorName: '배드민턴매니아',
    date: '2024-01-15',
    category: '후기',
    viewCount: 78,
    commentCount: 25,
  },
  {
    id: 2,
    title: '배드민턴 코트 추천',
    content:
      '서울 강남 지역에서 배드민턴을 칠 수 있는 좋은 코트를 찾고 있습니다. 주차가 편하고, 시설이 깨끗한 곳을 추천해주세요.',
    authorId: 'user789',
    authorName: '배드민턴러버',
    date: '2024-01-14',
    category: '추천',
    viewCount: 28,
    commentCount: 15,
  },
  {
    id: 3,
    title: '배드민턴 동호회 모집',
    content:
      '매주 일요일 오전에 배드민턴을 치는 동호회를 만들려고 합니다. 초보자도 환영하고, 실력 향상을 목표로 하는 분들 모집합니다.',
    authorId: 'user456',
    authorName: '배드민턴마스터',
    date: '2024-01-13',
    category: '모집',
    viewCount: 34,
    commentCount: 12,
  },
];

export default function BadmintonPage() {
  const handleAdClick = () => {
    console.log('배드민턴 광고 배너 클릭됨');
  };

  return (
    <Container>
      <CategoryTabs />
      <AdBanner
        title="🏸 배드민턴 대회 참가 신청"
        description="배드민턴 종목 대회에 참가하고 상금을 받아보세요!"
        onClick={handleAdClick}
      />
      <Content>
        <PostList>
          {mockPosts.map((post) => (
            <CommunityPost key={post.id} post={post} />
          ))}
        </PostList>
      </Content>
      <BottomNavigation />
    </Container>
  );
}
