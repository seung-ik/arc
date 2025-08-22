'use client';

import styled from 'styled-components';
import { useState } from 'react';
import PostHeader from '@/components/PostHeader';
import { Container, Content, PostContent } from '@/styles/PostDetailStyles';
import HtmlContent from './HtmlContent';
import { MentorPostData } from '@/types/post';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import PostInfoSection from './PostInfoSection';

interface MentorPostDetailProps {
  post: MentorPostData;
}

interface MentorApplication {
  id: number;
  mentorId: string;
  mentorName: string;
  mentorElo: number;
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  date: string;
}

const ApplyButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 10px;
  font-size: 15px;
  resize: vertical;
`;

// --- Mentor Application Status (copied and adapted from MatchApplicationStatus) ---
const ApplicationSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

const ApplicationCount = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const CountBadge = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const CountText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const MyApplication = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-top: 15px;
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ApplicationTitle = styled.h4`
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'pending':
        return '#e3f2fd';
      case 'approved':
        return '#e8f5e8';
      case 'rejected':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending':
        return '#1976d2';
      case 'approved':
        return '#2e7d32';
      case 'rejected':
        return '#d32f2f';
      default:
        return '#666';
    }
  }};
`;

const ApplicationDate = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const ApplicationComment = styled.div`
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #667eea;
`;

export default function MentorPostDetail({ post }: MentorPostDetailProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [myApplication, setMyApplication] = useState<MentorApplication | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [applicationCount, setApplicationCount] = useState<number>(3); // 예시 기본값 3명

  const handleApply = () => {
    setShowModal(true);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setCommentInput('');
  };

  const handleModalConfirm = () => {
    setMyApplication({
      id: Date.now(),
      mentorId: 'currentUser',
      mentorName: '나',
      mentorElo: 1500,
      status: 'pending',
      comment: commentInput.trim() || '멘토링 신청합니다!',
      date: new Date().toISOString().split('T')[0],
    });
    setIsApplied(true);
    setShowModal(false);
    setCommentInput('');
    setApplicationCount(prev => prev + 1);
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
            { label: '종목', value: post.sport },
            { label: 'ELO 레벨', value: post.elo },
            { label: '지역', value: post.location },
            {
              label: '수업료',
              value: post.tokenReward ? `${post.tokenReward} 토큰` : undefined,
              highlight: true,
            },
          ]}
        />

        <PostContent>
          <HtmlContent content={post.content} />
        </PostContent>

        <ApplyButton onClick={handleApply} disabled={isApplied}>
          {isApplied ? '신청 완료' : '멘토 신청하기'}
        </ApplyButton>

        {/* Mentor Application Status Section (MatchApplicationStatus 스타일 복사) */}
        <ApplicationSection>
          <ApplicationCount>
            <CountBadge>{applicationCount}</CountBadge>
            <CountText>멘토 신청</CountText>
          </ApplicationCount>

          {myApplication && (
            <MyApplication>
              <ApplicationHeader>
                <ApplicationTitle>내 신청 현황</ApplicationTitle>
                <StatusBadge status={myApplication.status}>
                  {myApplication.status === 'pending'
                    ? '대기중'
                    : myApplication.status === 'approved'
                      ? '승인됨'
                      : '거절됨'}
                </StatusBadge>
              </ApplicationHeader>
              <ApplicationDate>신청일: {myApplication.date}</ApplicationDate>
              <ApplicationComment>{myApplication.comment}</ApplicationComment>
            </MyApplication>
          )}
        </ApplicationSection>

        <TwoButtonModal
          isOpen={showModal}
          onClose={handleModalCancel}
          title="멘토 신청"
          content={
            <ModalTextarea
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="멘티에게 전달할 메시지를 입력하세요..."
              maxLength={300}
              autoFocus
            />
          }
          cancelText="취소"
          confirmText="신청"
          onSubmit={handleModalConfirm}
        />
      </Content>
    </Container>
  );
}
