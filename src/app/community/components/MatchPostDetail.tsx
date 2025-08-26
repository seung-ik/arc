'use client';

import styled from 'styled-components';
import { useState } from 'react';
import PostHeader from './PostHeader';
import MatchInfo from './MatchInfo';
import MatchApplicationStatus from './MatchApplicationStatus';
import { useModal } from '@/hooks/useModal';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { Container, Content, PostContent } from '@/styles/PostDetailStyles';
import HtmlContent from '@/components/inputs/HtmlContent';
import { useApplyToMatchPostMutation } from '@/api/useMatch';
import { MatchPostData } from '@/types/post';
import Image from 'next/image';
import { ICONS } from '@/assets';

interface MatchPostDetailProps {
  post: MatchPostData;
}

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  width: 100%;
`;

const JoinButton = styled.button`
  background: linear-gradient(135deg, #4a7c8a 0%, #23424a 50%, #1a3137 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(35, 66, 74, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ChatButton = styled.button`
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(90deg, #ff6d75 50%, #9c86ff 100%) border-box;
  color: #ff6d75;
  border: 2px solid transparent;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 109, 117, 0.3);
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
  const applyToMatchPost = useApplyToMatchPostMutation();

  const handleJoin = () => {
    applicationModal.openModal();
  };

  const handleSubmit = () => {
    // 실제 API 호출로 매치 신청
    applyToMatchPost.mutate(
      {
        postId: post.id,
        message: comment,
      },
      {
        onSuccess: response => {
          console.log('매치 신청 응답:', response);
          setIsJoined(true);

          applicationModal.closeModal();
          setComment('');
        },
        onError: error => {
          console.error('매치 신청 실패:', error);
          alert('매치 신청에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  const handleCancel = () => {
    applicationModal.closeModal();
    setComment('');
  };

  const isExpired = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate <= now;
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
          viewCount={0} // 서버 데이터에 없으므로 기본값 사용
          authorProfileImage={post.author.profileImageUrl || undefined}
        />

        <MatchInfo matchInfo={post.matchInfo} />

        <PostContent>
          <HtmlContent content={post.content} />
        </PostContent>

        <ButtonContainer>
          <JoinButton
            onClick={handleJoin}
            disabled={isJoined || isExpired(post.matchInfo.deadline)}
          >
            {isJoined
              ? '참가 신청 완료'
              : isExpired(post.matchInfo.matchDate)
                ? '마감된 매치'
                : '매치 참가하기'}
          </JoinButton>

          <ChatButton
            onClick={() => alert('준비중인 기능입니다.')}
            disabled={isExpired(post.matchInfo.matchDate)}
          >
            <Image src={ICONS.VERYCHAT} alt="verychat" width={20} height={20} />
            채팅방 참여하기
          </ChatButton>
        </ButtonContainer>

        <MatchApplicationStatus
          postId={post.id}
          participants={post.participants}
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
