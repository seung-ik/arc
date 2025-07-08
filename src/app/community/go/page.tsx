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

// 바둑 관련 임시 게시글 데이터
const mockPosts = [
  {
    id: 1,
    title: '바둑 기보 분석',
    content:
      '오늘 프로 기사와의 대국에서 배운 수를 분석해보았습니다. 특히 중반전에서의 포석이 인상적이었어요. 3-3 포인트에서의 응수법을 정리해보겠습니다.',
    authorId: 'user202',
    authorName: '바둑학도',
    date: '2024-01-15',
    category: '분석',
    viewCount: 56,
    commentCount: 18,
  },
  {
    id: 2,
    title: '바둑 동호회 모집',
    content:
      '서울 강북 지역에서 바둑을 두는 동호회를 만들려고 합니다. 실력에 관계없이 즐겁게 두실 분들 모집합니다. 매주 토요일 오후에 모입니다.',
    authorId: 'user303',
    authorName: '바둑마스터',
    date: '2024-01-14',
    category: '모집',
    viewCount: 34,
    commentCount: 12,
  },
  {
    id: 3,
    title: '바둑 실력 향상 팁',
    content:
      '바둑을 시작한 지 1년이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 중반전에서의 전략적 판단에 어려움을 겪고 있어요.',
    authorId: 'user456',
    authorName: '바둑초보',
    date: '2024-01-13',
    category: '질문',
    viewCount: 42,
    commentCount: 16,
  },
];

export default function GoPage() {
  const handleAdClick = () => {
    console.log('바둑 광고 배너 클릭됨');
  };

  return (
    <Container>
      <CategoryTabs />
      <AdBanner
        title="🏁 바둑 대회 참가 신청"
        description="바둑 종목 대회에 참가하고 상금을 받아보세요!"
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
