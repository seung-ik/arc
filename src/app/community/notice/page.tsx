'use client';

import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityPost from '@/components/CommunityPost';

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

// 공지사항 임시 데이터
const mockPosts = [
  {
    id: 1,
    title: '[공지] 종목별 후원 순위 안내',
    content:
      '안녕하세요! 현재 종목별 후원 순위를 안내드립니다. 후원받은 토큰 순서에 따라 상단 탭의 순서가 결정됩니다. 후원받은 토큰의 일부는 소각되고, 나머지는 대회 자금으로 사용됩니다. 현재 순위: 1위 테니스(890토큰), 2위 배드민턴(670토큰), 3위 바둑(450토큰), 4위 탁구(320토큰), 5위 체스(280토큰), 6위 당구(150토큰)',
    authorId: 'admin',
    authorName: '관리자',
    date: '2024-01-15',
    category: '공지',
    viewCount: 1250,
    commentCount: 45,
  },
  {
    id: 2,
    title: '[공지] 커뮤니티 이용 규칙 안내',
    content:
      '커뮤니티 이용 규칙을 안내드립니다. 1. 타인을 비방하거나 욕설을 사용하지 마세요. 2. 스팸이나 광고성 글은 금지됩니다. 3. 각 종목에 맞는 내용만 작성해주세요. 4. 저작권을 침해하는 내용은 금지됩니다. 위반 시 글 삭제 및 계정 제재가 있을 수 있습니다.',
    authorId: 'admin',
    authorName: '관리자',
    date: '2024-01-14',
    category: '공지',
    viewCount: 890,
    commentCount: 23,
  },
  {
    id: 3,
    title: '[공지] 토큰 시스템 업데이트 안내',
    content:
      '토큰 시스템이 업데이트되었습니다. 주요 변경사항: 1. 프로필에 글 노출 시 1토큰 소각, 2. 종목별 후원 시 일부 토큰 소각 및 대회 자금으로 사용, 3. 후원 순위에 따른 상단 탭 순서 변경. 자세한 내용은 FAQ를 참고해주세요.',
    authorId: 'admin',
    authorName: '관리자',
    date: '2024-01-13',
    category: '공지',
    viewCount: 756,
    commentCount: 31,
  },
  {
    id: 4,
    title: '[공지] 첫 번째 대회 개최 안내',
    content:
      '첫 번째 종목별 대회가 개최됩니다! 후원받은 토큰으로 운영되는 대회로, 각 종목별로 상금이 지급됩니다. 대회 일정: 2월 15일~20일, 참가 신청: 1월 25일~2월 10일. 자세한 내용은 각 종목별 게시판을 확인해주세요.',
    authorId: 'admin',
    authorName: '관리자',
    date: '2024-01-12',
    category: '공지',
    viewCount: 1200,
    commentCount: 67,
  },
  {
    id: 5,
    title: '[공지] 앱 업데이트 안내',
    content:
      '앱이 업데이트되었습니다. 주요 개선사항: 1. 커뮤니티 종목별 분리, 2. 프로필 시스템 개선, 3. ELO 매치 관리 기능 추가, 4. 토큰 시스템 도입. 더 나은 서비스를 위해 계속 노력하겠습니다.',
    authorId: 'admin',
    authorName: '관리자',
    date: '2024-01-11',
    category: '공지',
    viewCount: 678,
    commentCount: 28,
  },
];

export default function NoticePage() {
  return (
    <Container>
      <CategoryTabs />
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
