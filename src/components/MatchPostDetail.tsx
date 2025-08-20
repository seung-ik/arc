'use client';

import styled from 'styled-components';
import { useState } from 'react';
import PostHeader from '@/components/PostHeader';
import MatchInfo from '@/components/MatchInfo';
import MatchApplicationStatus from '@/components/MatchApplicationStatus';
import { useModal } from '@/hooks/useModal';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { Container, Content, PostContent } from '@/styles/PostDetailStyles';
import HtmlContent from './HtmlContent';
import { MatchPost } from '@/types/post';

interface MatchPostDetailProps {
  post: MatchPost;
}

const JoinButton = styled.button`
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

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 20px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export default function MatchPostDetail({ post }: MatchPostDetailProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [comment, setComment] = useState('');
  const applicationModal = useModal();
  console.log(post);
  // Mock data - 실제로는 API에서 가져올 데이터
  const [myApplication, setMyApplication] = useState<{
    status: 'pending' | 'approved' | 'rejected';
    comment: string;
    date: string;
  } | null>(null);
  const totalApplications = 3; // Mock data

  const handleJoin = () => {
    applicationModal.openModal();
  };

  const handleSubmit = () => {
    setIsJoined(true);
    setMyApplication({
      status: 'pending',
      comment: comment,
      date: new Date().toISOString().split('T')[0],
    });
    applicationModal.closeModal();
    setComment('');
  };

  const handleCancel = () => {
    applicationModal.closeModal();
    setComment('');
  };

  const isExpired = (validityPeriod: string | number | undefined) => {
    if (typeof validityPeriod === 'string') {
      return parseInt(validityPeriod) <= 0;
    }
    return (validityPeriod || 0) <= 0;
  };

  const modalContent = (
    <CommentTextarea
      placeholder="참가하고 싶은 이유나 간단한 메시지를 남겨주세요..."
      value={comment}
      onChange={e => setComment(e.target.value)}
    />
  );

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
          authorProfileImage={post.author.profileImageUrl || undefined}
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

        <JoinButton
          onClick={handleJoin}
          disabled={isJoined || isExpired(post.validityPeriod || 0)}
        >
          {isJoined
            ? '참가 신청 완료'
            : isExpired(post.validityPeriod || 0)
              ? '마감된 매치'
              : '매치 참가하기'}
        </JoinButton>

        <MatchApplicationStatus
          totalApplications={totalApplications}
          myApplication={myApplication}
        />
      </Content>

      <TwoButtonModal
        isOpen={applicationModal.isOpen}
        onClose={handleCancel}
        title="매치 참가 신청"
        content={modalContent}
        cancelText="취소"
        confirmText="신청하기"
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
