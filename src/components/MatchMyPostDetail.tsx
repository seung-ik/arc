'use client';

import { useState } from 'react';
import MatchApplicationList from '@/components/MatchApplicationList';
import MatchInfo from '@/components/MatchInfo';
import PostHeader from '@/components/PostHeader';
import {
  Container,
  Content,
  PostContent,
  ManagementSection,
  ManagementTitle,
  ManagementButtons,
  ManagementButton,
} from '@/styles/PostDetailStyles';
import { MatchPost } from '@/types/post';
import HtmlContent from './HtmlContent';

interface MatchApplication {
  id: number;
  userId: string;
  userName: string;
  userElo: number;
  message: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface MatchMyPostDetailProps {
  post: MatchPost;
}

export default function MatchMyPostDetail({ post }: MatchMyPostDetailProps) {
  const [applications, setApplications] = useState<MatchApplication[]>([
    {
      id: 1,
      userId: 'user123',
      userName: '테니스러버',
      userElo: 1450,
      message:
        '안녕하세요! 실력이 비슷해서 좋을 것 같습니다. 함께 치고 싶어요!',
      appliedAt: '2024-01-20',
      status: 'pending',
    },
    {
      id: 2,
      userId: 'user456',
      userName: '테니스매니아',
      userElo: 1520,
      message: '저도 참가하고 싶습니다. 주말에 가능하시면 연락주세요.',
      appliedAt: '2024-01-19',
      status: 'approved',
    },
    {
      id: 3,
      userId: 'user789',
      userName: '테니스초보',
      userElo: 1200,
      message: '초보지만 열심히 하겠습니다!',
      appliedAt: '2024-01-18',
      status: 'rejected',
    },
  ]);

  const handleDelete = () => {
    // TODO: 삭제 처리
    console.log('Delete post:', post.id);
  };

  const handleApproveApplication = (applicationId: number) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, status: 'approved' as const } : app
      )
    );
    // TODO: API 호출로 승인 처리
    console.log('Approve application:', applicationId);
  };

  const handleRejectApplication = (applicationId: number) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, status: 'rejected' as const } : app
      )
    );
    // TODO: API 호출로 거절 처리
    console.log('Reject application:', applicationId);
  };

  return (
    <Container>
      <Content>
        <PostHeader
          title={post.title}
          authorId={post.author.id}
          authorName={post.author.nickname}
          date={post.createdAt}
          postType={post.type}
          viewCount={post.viewCount}
        />

        <MatchInfo
          elo={typeof post.elo === 'string' ? parseInt(post.elo) : post.elo}
          location={post.location}
          desiredSkillLevel={post.desiredSkillLevel}
          validityPeriod={
            typeof post.validityPeriod === 'string'
              ? parseInt(post.validityPeriod)
              : post.validityPeriod
          }
        />

        <PostContent>
          <HtmlContent content={post.content} />
        </PostContent>

        <ManagementSection>
          <ManagementTitle>게시글 관리</ManagementTitle>
          <ManagementButtons>
            <ManagementButton onClick={handleDelete} $variant="delete">
              삭제
            </ManagementButton>
            <ManagementButton onClick={handleDelete} $variant="edit">
              마감
            </ManagementButton>
          </ManagementButtons>
        </ManagementSection>

        <MatchApplicationList
          applications={applications}
          onApprove={handleApproveApplication}
          onReject={handleRejectApplication}
        />
      </Content>
    </Container>
  );
}
