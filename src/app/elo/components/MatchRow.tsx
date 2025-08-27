import styled from 'styled-components';
import { useState } from 'react';
import { useHandleMatchRequestMutation } from '@/api/useMatch';
import { MatchResult } from '@/types/match';
import { useTimer } from '@/hooks/useTimer';
import TwoButtonModal from '../../../components/modals/TwoButtonModal';
import { formatTimeRemaining } from '@/utils';
import ProgressIndicator from '@/components/ProgressIndicator';

// 스타일 컴포넌트들
const RowItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
`;

const SportBadge = styled.div`
  background: ${props => props.theme.colors.backgroundGray};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 24px;
  margin-right: ${props => props.theme.spacing.sm};
`;

const ContentSection = styled.div`
  flex: 1;
`;

const UserName = styled.button`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  text-decoration: underline;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primaryHover};
  }
`;

const UserInfo = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
`;

const TimerText = styled.div`
  position: absolute;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
`;

const ActionButtons = styled.div`
  margin-left: ${props => props.theme.spacing.lg};
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  z-index: 1;
`;

const ActionButton = styled.button<{ $variant: 'accept' | 'reject' }>`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props =>
    props.$variant === 'accept'
      ? props.theme.colors.success
      : props.theme.colors.error};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
  z-index: 9;
`;

// 스포츠 이모지 매핑
const getSportEmoji = (sport: string) => {
  const emojiMap: Record<string, string> = {
    탁구: '🏓',
    배드민턴: '🏸',
    당구: '🎱',
    바둑: '🏁',
    테니스: '🎾',
    체스: '♟️',
  };
  return emojiMap[sport] || '⚽';
};

interface MatchRowProps {
  match: MatchResult;
  onOpponentClick: (opponentId: string) => void;
}

const MatchRow: React.FC<MatchRowProps> = ({ match, onOpponentClick }) => {
  const { seconds, progress, color } = useTimer(
    match.expiredTime,
    match.createdAt
  );
  const handleMatchRequest = useHandleMatchRequestMutation();
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Accept 모달 확인
  const handleAcceptConfirm = async () => {
    try {
      await handleMatchRequest.mutateAsync({
        matchId: match.id,
        action: 'accept',
      });
    } catch (error) {
      console.error('매치 요청 수락 실패:', error);
    }
    setAcceptModalOpen(false);
  };

  // Reject 모달 확인
  const handleRejectConfirm = async () => {
    try {
      await handleMatchRequest.mutateAsync({
        matchId: match.id,
        action: 'reject',
      });
    } catch (error) {
      console.error('매치 요청 거절 실패:', error);
    }
    setRejectModalOpen(false);
    setRejectReason('');
  };

  return (
    <>
      <RowItem>
        <SportBadge>{getSportEmoji(match.sportCategoryName)}</SportBadge>

        <ContentSection>
          <UserName onClick={() => onOpponentClick(match.senderNickname)}>
            {match.senderNickname}
          </UserName>
          <UserInfo>
            스포츠: {match.sportCategoryName} / 결과:{' '}
            {match.senderResult === 'win' ? '패' : '승'}
          </UserInfo>
        </ContentSection>
        <ProgressIndicator progress={progress} color={color}>
          <TimerText>{formatTimeRemaining(seconds)}</TimerText>
        </ProgressIndicator>

        <ActionButtons>
          <ActionButton
            $variant="accept"
            onClick={() => {
              console.log('승인 버튼 클릭됨');
              setAcceptModalOpen(true);
            }}
          >
            승인
          </ActionButton>
          <ActionButton
            $variant="reject"
            onClick={() => {
              console.log('거부 버튼 클릭됨');
              setRejectModalOpen(true);
            }}
          >
            거부
          </ActionButton>
        </ActionButtons>
      </RowItem>

      {/* Accept 모달 */}
      <TwoButtonModal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        title="매치 요청 승인"
        content="이 매치 요청을 승인하시겠습니까?"
        confirmText="승인"
        cancelText="취소"
        onSubmit={handleAcceptConfirm}
      />

      {/* Reject 모달 */}
      <TwoButtonModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="매치 요청 거절"
        content={
          <div>
            <p>이 매치 요청을 거절하시겠습니까?</p>
            <input
              type="text"
              placeholder="거절 사유 (선택사항)"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              style={{ marginTop: '10px', width: '100%', padding: '8px' }}
            />
          </div>
        }
        confirmText="거절"
        cancelText="취소"
        onSubmit={handleRejectConfirm}
      />
    </>
  );
};

export default MatchRow;
