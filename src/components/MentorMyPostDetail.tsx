'use client';

import styled from 'styled-components';
import { useState } from 'react';
import PostHeader from '@/components/PostHeader';
import MentorApplicationList from '@/components/MentorApplicationList';
import { Container, Content, PostContent } from '@/styles/PostDetailStyles';
import { MentorPostData } from '@/types/post';
import HtmlContent from './HtmlContent';
import PostInfoSection from './PostInfoSection';

interface MentorApplication {
  id: number;
  mentorId: string;
  mentorName: string;
  mentorElo: number;
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  date: string;
}

interface MentorMyPostDetailProps {
  post: MentorPostData;
}

const ManagementSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

const ManagementTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const ManagementButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ManagementButton = styled.button<{ $variant: string }>`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => {
    switch (props.$variant) {
      case 'edit':
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
      case 'delete':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      case 'profile':
        return `
          background: #28a745;
          color: white;
          &:hover { background: #218838; }
        `;
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #545b62; }
        `;
    }
  }}
`;

export default function MentorMyPostDetail({ post }: MentorMyPostDetailProps) {
  const [applications, setApplications] = useState<MentorApplication[]>([
    {
      id: 1,
      mentorId: 'mentor1',
      mentorName: '홍길동',
      mentorElo: 1800,
      status: 'pending',
      comment: '멘토링 신청합니다!',
      date: '2024-06-01',
    },
    {
      id: 2,
      mentorId: 'mentor2',
      mentorName: '이몽룡',
      mentorElo: 1700,
      status: 'approved',
      comment: '경험 많아요.',
      date: '2024-06-02',
    },
  ]);

  const handleApprove = (applicationId: number) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, status: 'approved' } : app
      )
    );
  };

  const handleReject = (applicationId: number) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, status: 'rejected' } : app
      )
    );
  };

  const handleDelete = () => {
    // TODO: 삭제 처리
    alert(`Delete post::${post.id}`);
  };

  const handlePayment = (applicationId: number) => {
    // TODO: 실제 지불 로직 구현
    alert(`Payment sent for application:${applicationId}`);
    alert('전송완료 되었습니다.');
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

        <PostInfoSection
          items={[
            { label: '구하는 종목', value: post.sport },
            { label: '현재 ELO', value: post.elo },
            { label: '선호 지역', value: post.location },
            {
              label: '제안 예산',
              value: post.tokenReward ? `${post.tokenReward} 토큰` : undefined,
              highlight: true,
            },
          ]}
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

        <MentorApplicationList
          applications={applications}
          onApprove={handleApprove}
          onReject={handleReject}
          onPayment={handlePayment}
        />
      </Content>
    </Container>
  );
}
