'use client';

import styled from 'styled-components';
import { useState } from 'react';
import PostHeader from '@/components/PostHeader';
import MentorApplicationList from '@/components/MentorApplicationList';
import { Container, Content, PostContent } from '@/styles/PostDetailStyles';
import { MentorPost } from '@/types/post';

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
  post: MentorPost;
}

const MenteeInfoSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #e9ecef;
`;

const MenteeInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const MenteeInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenteeInfoLabel = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`;

const MenteeInfoValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

const BudgetValue = styled.span`
  font-size: 16px;
  color: #667eea;
  font-weight: 700;
`;

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
    console.log('Delete post:', post.id);
  };

  const handlePayment = (applicationId: number) => {
    // TODO: 실제 지불 로직 구현
    console.log('Payment sent for application:', applicationId);
    alert('전송완료 되었습니다.');
  };

  return (
    <Container>
      <Content>
        <PostHeader
          title={post.title}
          authorId={post.authorId}
          authorName={post.authorName}
          date={post.date}
          postType={post.postType}
          viewCount={post.viewCount}
        />

        <MenteeInfoSection>
          <MenteeInfoGrid>
            {post.sport && (
              <MenteeInfoItem>
                <MenteeInfoLabel>구하는 종목</MenteeInfoLabel>
                <MenteeInfoValue>{post.sport}</MenteeInfoValue>
              </MenteeInfoItem>
            )}
            {post.elo && (
              <MenteeInfoItem>
                <MenteeInfoLabel>현재 ELO</MenteeInfoLabel>
                <MenteeInfoValue>{post.elo}</MenteeInfoValue>
              </MenteeInfoItem>
            )}
            {post.location && (
              <MenteeInfoItem>
                <MenteeInfoLabel>선호 지역</MenteeInfoLabel>
                <MenteeInfoValue>{post.location}</MenteeInfoValue>
              </MenteeInfoItem>
            )}
            {post.tokenReward && (
              <MenteeInfoItem>
                <MenteeInfoLabel>제안 예산</MenteeInfoLabel>
                <BudgetValue>{post.tokenReward} 토큰</BudgetValue>
              </MenteeInfoItem>
            )}
          </MenteeInfoGrid>
        </MenteeInfoSection>

        <PostContent>{post.content}</PostContent>

        <ManagementSection>
          <ManagementTitle>게시글 관리</ManagementTitle>
          <ManagementButtons>
            <ManagementButton onClick={handleDelete} $variant="delete">
              삭제
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
