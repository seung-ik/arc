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
  padding-bottom: 80px; /* 하단 네비게이션 높이만큼 패딩 */
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

// 인기글 임시 데이터 (모든 스포츠의 인기 게시글들)
const mockPosts = [
  {
    id: 1,
    title: '테니스 라켓 구매 후기',
    content:
      '최근에 Wilson Pro Staff RF97을 구매했습니다. 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다. 특히 서브와 포핸드에서 위력이 대단합니다.',
    authorId: 'user303',
    authorName: '테니스매니아',
    date: '2024-01-15',
    category: '후기',
    viewCount: 89,
    commentCount: 31,
  },
  {
    id: 2,
    title: '당구 실력 향상 팁',
    content:
      '당구를 시작한 지 3개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 큐 각도 잡는 법과 파워 조절에 어려움을 겪고 있어요. 고수분들의 조언 부탁드립니다!',
    authorId: 'user202',
    authorName: '당구초보',
    date: '2024-01-15',
    category: '질문',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 3,
    title: '탁구 동호회 모집합니다!',
    content:
      '매주 토요일 오후에 탁구를 치는 동호회를 만들려고 합니다. 초보자도 환영하고, 실력 향상을 목표로 하는 분들 모집합니다. 관심 있으신 분들은 댓글로 연락처 남겨주세요!',
    authorId: 'user123',
    authorName: '탁구마스터',
    date: '2024-01-15',
    category: '모집',
    viewCount: 45,
    commentCount: 8,
  },
  {
    id: 4,
    title: '체스 전략 공유',
    content:
      '오늘 상대방과 체스 대결에서 사용한 전략을 공유합니다. 킹스 인디언 어택을 사용했는데, 상대방이 예상보다 잘 막아내서 고전했습니다. 더 나은 전략이 있으시면 조언 부탁드립니다.',
    authorId: 'user456',
    authorName: '체스왕',
    date: '2024-01-14',
    category: '전략',
    viewCount: 32,
    commentCount: 12,
  },
  {
    id: 5,
    title: '배드민턴 라켓 구매 후기',
    content:
      'Yonex Voltric Z-Force II를 구매했습니다. 라이트 헤드 무거운 그립 타입인데, 스매시가 정말 강력합니다. 특히 백핸드 클리어가 훨씬 안정적이에요.',
    authorId: 'user101',
    authorName: '배드민턴매니아',
    date: '2024-01-14',
    category: '후기',
    viewCount: 78,
    commentCount: 25,
  },
];

export default function CommunityPage() {
  const handleAdClick = () => {
    console.log('광고 배너 클릭됨');
    // 실제로는 광고 링크로 이동하거나 모달을 열 수 있음
  };

  return (
    <Container>
      <CategoryTabs />
      <AdBanner onClick={handleAdClick} />
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
