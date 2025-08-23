'use client';

import styled from 'styled-components';
import { useRespondToMatchRequestMutation } from '@/api/useMatch';

interface MatchApplicationStatusProps {
  postId: number;
  participants: {
    confirmed: Array<{
      userId: number;
      nickname: string;
      profileImageUrl: string | null;
      elo: number | null;
      requestedAt: string;
      message: string;
    }>;
    pending: Array<{
      userId: number;
      nickname: string;
      profileImageUrl: string | null;
      elo: number | null;
      requestedAt: string;
      message: string;
    }>;
    rejected: Array<{
      userId: number;
      nickname: string;
      profileImageUrl: string | null;
      elo: number | null;
      requestedAt: string;
      message: string;
    }>;
  };
  isMyPost?: boolean;
}

const ApplicationSection = styled.div`
  margin-top: 30px;
  padding: 20px 0;
  border-top: 2px solid #e9ecef;
`;

const ParticipantsSection = styled.div`
  margin-bottom: 20px;
`;

const ParticipantsTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const ParticipantCard = styled.div<{ variant: 'confirmed' | 'pending' }>`
  background: white;
  border: 1px solid
    ${props => (props.variant === 'confirmed' ? '#e8f5e8' : '#e3f2fd')};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PendingCard = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Nickname = styled.span`
  font-weight: 600;
  color: #333;
`;

const StatusBadge = styled.span<{ variant: 'confirmed' | 'pending' }>`
  background: ${props =>
    props.variant === 'confirmed' ? '#e8f5e8' : '#e3f2fd'};
  color: ${props => (props.variant === 'confirmed' ? '#2e7d32' : '#1976d2')};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
`;

const DateText = styled.span`
  font-size: 12px;
  color: #666;
`;

const EloText = styled.span<{ variant: 'confirmed' | 'pending' }>`
  color: ${props => (props.variant === 'confirmed' ? '#2e7d32' : '#1976d2')};
  font-size: 14px;
  font-weight: 600;
`;

const MessageBox = styled.div`
  font-size: 13px;
  color: #555;
  line-height: 1.4;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 6px;
  border-left: 3px solid #1976d2;
  margin-bottom: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ variant: 'approve' | 'reject' }>`
  background: ${props => (props.variant === 'approve' ? '#e8f5e8' : '#ffebee')};
  color: ${props => (props.variant === 'approve' ? '#2e7d32' : '#d32f2f')};
  border: 1px solid
    ${props => (props.variant === 'approve' ? '#2e7d32' : '#d32f2f')};
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props =>
      props.variant === 'approve' ? '#2e7d32' : '#d32f2f'};
    color: white;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function MatchApplicationStatus({
  postId,
  participants,
  isMyPost = false,
}: MatchApplicationStatusProps) {
  const respondToMatchRequest = useRespondToMatchRequestMutation();
  console.log(postId, 'postId');

  const handleAccept = (userId: number) => {
    respondToMatchRequest.mutate(
      {
        postId,
        action: 'accept',
        responseMessage: '승인되었습니다.',
      },
      {
        onSuccess: () => {
          console.log('승인 성공:', userId);
          alert('승인 성공');
        },
        onError: error => {
          console.error('승인 실패:', error);
          alert('승인 처리에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  const handleReject = (userId: number) => {
    respondToMatchRequest.mutate(
      {
        postId,
        action: 'reject',
        responseMessage: '거절되었습니다.',
      },
      {
        onSuccess: () => {
          console.log('거절 성공:', userId);
        },
        onError: error => {
          console.error('거절 실패:', error);
          alert('거절 처리에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  return (
    <ApplicationSection>
      {/* 참여자 목록 */}
      <ParticipantsSection>
        <ParticipantsTitle>
          참여자 목록 (
          {participants.confirmed.length + participants.pending.length}명)
        </ParticipantsTitle>

        {/* 승인된 참가자들 */}
        {participants.confirmed.map((participant, index) => (
          <ParticipantCard key={`confirmed-${index}`} variant="confirmed">
            <Nickname>{participant.nickname}</Nickname>
            <RightGroup>
              {participant.elo && (
                <EloText variant="confirmed">ELO {participant.elo}</EloText>
              )}
              <StatusBadge variant="confirmed">승인됨</StatusBadge>
            </RightGroup>
          </ParticipantCard>
        ))}

        {/* 대기중인 신청자들 */}
        {participants.pending.map((applicant, index) => (
          <PendingCard key={`pending-${index}`}>
            <CardHeader>
              <LeftGroup>
                <Nickname>{applicant.nickname}</Nickname>
                <StatusBadge variant="pending">대기중</StatusBadge>
              </LeftGroup>
              <RightGroup>
                <DateText>
                  {new Date(applicant.requestedAt).toLocaleDateString('ko-KR')}
                </DateText>
                {applicant.elo && (
                  <EloText variant="pending">ELO {applicant.elo}</EloText>
                )}
              </RightGroup>
            </CardHeader>

            {applicant.message && <MessageBox>{applicant.message}</MessageBox>}

            {/* 승인/거절 버튼 - 내 글일 때만 표시 */}
            {isMyPost && (
              <ButtonGroup>
                <ActionButton
                  variant="approve"
                  onClick={() => handleAccept(applicant.userId)}
                  disabled={respondToMatchRequest.isPending}
                >
                  {respondToMatchRequest.isPending ? '처리중...' : '승인'}
                </ActionButton>
                <ActionButton
                  variant="reject"
                  onClick={() => handleReject(applicant.userId)}
                  disabled={respondToMatchRequest.isPending}
                >
                  {respondToMatchRequest.isPending ? '처리중...' : '거절'}
                </ActionButton>
              </ButtonGroup>
            )}
          </PendingCard>
        ))}
      </ParticipantsSection>
    </ApplicationSection>
  );
}
