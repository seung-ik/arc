'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TwoButtonModal from '@/components/TwoButtonModal';
import { ROUTES } from '@/constants/routes';

interface Match {
  id: number;
  opponentId: string;
  sport: string;
  result: string;
  date: string;
  isWin: boolean;
  myElo: number;
  opponentElo: number;
  createdAt: number;
}

interface MatchManagementProps {
  matches: Match[];
  onAccept: (matchId: number) => void;
  onReject: (matchId: number, reason?: string) => void;
}

// 시계형 원형 프로그레스 바 컴포넌트
const CircularProgress = styled.div<{ $progress: number; $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => props.$color} 0deg ${props => props.$progress}deg,
    ${props => props.theme.colors.backgroundGray} ${props => props.$progress}deg
      360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.theme.colors.background};
  }
`;

const TimerText = styled.div`
  position: absolute;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
`;

// 로우 아이템 스타일드 컴포넌트들
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

const ActionButtons = styled.div`
  margin-left: ${props => props.theme.spacing.sm};
  display: flex;
  gap: ${props => props.theme.spacing.sm};
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
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textGray};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.md};
`;

// 스포츠별 이모지 매핑
const getSportEmoji = (sport: string) => {
  switch (sport) {
    case '탁구':
      return '🏓';
    case '배드민턴':
      return '🏸';
    case '당구':
      return '🎱';
    case '바둑':
      return '🏁';
    case '테니스':
      return '🎾';
    case '체스':
      return '♟️';
    default:
      return '🏆';
  }
};

// 타이머 계산 함수
const calculateTimeRemaining = (
  createdAt: number
): { hours: number; minutes: number; progress: number; color: string } => {
  const now = Date.now();
  const elapsed = now - createdAt;
  const totalTime = 12 * 60 * 60 * 1000; // 12시간을 밀리초로
  const remaining = totalTime - elapsed;

  if (remaining <= 0) {
    return { hours: 0, minutes: 0, progress: 360, color: '#dc3545' }; // 빨간색
  }

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const progress = (elapsed / totalTime) * 360;

  let color = '#28a745'; // 초록색
  if (progress > 240) {
    // 8시간 이상 경과
    color = '#ffc107'; // 노란색
  }
  if (progress > 330) {
    // 11시간 이상 경과
    color = '#dc3545'; // 빨간색
  }

  return { hours, minutes, progress, color };
};

export default function MatchManagement({
  matches,
  onAccept,
  onReject,
}: MatchManagementProps) {
  const router = useRouter();
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [, forceUpdate] = useState({});

  // 1초마다 타이머 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOpponentClick = (opponentId: string) => {
    router.push(ROUTES.profile.user(opponentId));
  };

  // Accept 버튼 클릭
  const handleAcceptClick = (matchId: number) => {
    setSelectedMatchId(matchId);
    setAcceptModalOpen(true);
  };
  // Reject 버튼 클릭
  const handleRejectClick = (matchId: number) => {
    setSelectedMatchId(matchId);
    setRejectReason('');
    setRejectModalOpen(true);
  };
  // Accept 모달 확인
  const handleAcceptConfirm = () => {
    if (selectedMatchId !== null) {
      onAccept(selectedMatchId);
    }
    setAcceptModalOpen(false);
    setSelectedMatchId(null);
  };
  // Reject 모달 확인
  const handleRejectConfirm = () => {
    if (selectedMatchId !== null) {
      onReject(selectedMatchId, rejectReason);
    }
    setRejectModalOpen(false);
    setSelectedMatchId(null);
    setRejectReason('');
  };

  return (
    <>
      <div>
        {matches.length > 0 ? (
          matches.map(match => {
            const { hours, minutes, progress, color } = calculateTimeRemaining(
              match.createdAt
            );
            return (
              <RowItem key={match.id}>
                <SportBadge>{getSportEmoji(match.sport)}</SportBadge>
                <ContentSection>
                  <UserName
                    onClick={() => handleOpponentClick(match.opponentId)}
                  >
                    {match.opponentId}
                  </UserName>
                  <UserInfo>
                    내 Elo: {match.myElo} / 상대 Elo: {match.opponentElo}
                  </UserInfo>
                </ContentSection>
                <CircularProgress $progress={progress} $color={color}>
                  <TimerText>{`${hours}:${minutes.toString().padStart(2, '0')}`}</TimerText>
                </CircularProgress>
                <ActionButtons>
                  <ActionButton
                    $variant="accept"
                    onClick={() => handleAcceptClick(match.id)}
                  >
                    승인
                  </ActionButton>
                  <ActionButton
                    $variant="reject"
                    onClick={() => handleRejectClick(match.id)}
                  >
                    거부
                  </ActionButton>
                </ActionButtons>
              </RowItem>
            );
          })
        ) : (
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <p>처리할 매치가 없습니다</p>
          </EmptyState>
        )}
      </div>

      <TwoButtonModal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        title="매치 승인"
        content="이 매치 결과를 승인하시겠습니까?"
        cancelText="취소"
        confirmText="승인"
        onSubmit={handleAcceptConfirm}
      />

      <TwoButtonModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="매치 거부"
        content={
          <div>
            <p>이 매치 결과를 거부하시겠습니까?</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="거부 사유를 입력하세요 (선택사항)"
              style={{
                width: '100%',
                minHeight: '80px',
                marginTop: '8px',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical',
              }}
            />
          </div>
        }
        cancelText="취소"
        confirmText="거부"
        onSubmit={handleRejectConfirm}
      />
    </>
  );
}
