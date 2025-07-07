'use client';

import styled from 'styled-components';
import { useState } from 'react';
import TwoButtonModal from '@/components/TwoButtonModal';

interface Match {
  id: number;
  opponentId: string;
  sport: string;
  result: string;
  date: string;
  isWin: boolean;
  myElo: number;
  opponentElo: number;
}

interface MatchManagementProps {
  matches: Match[];
  onAccept: (matchId: number) => void;
  onReject: (matchId: number, reason?: string) => void;
}

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const MatchCard = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const OpponentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const OpponentId = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.colors.textBlack};
`;

const SportBadge = styled.span`
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
`;

const MatchDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const ResultInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const ResultBadge = styled.span<{ $isWin: boolean }>`
  background-color: ${(props) => (props.$isWin ? '#28a745' : '#dc3545')};
  color: white;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: 600;
`;

const DateText = styled.span`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`;

const ActionButton = styled.button<{ $variant: 'accept' | 'reject' }>`
  flex: 1;
  background-color: ${(props) => (props.$variant === 'accept' ? '#28a745' : '#dc3545')};
  color: white;
  border: none;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: 600;
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
  padding: ${(props) => props.theme.spacing.xl};
  color: ${(props) => props.theme.colors.textGray};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const EloInfo = styled.div`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

export default function MatchManagement({ matches, onAccept, onReject }: MatchManagementProps) {
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

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
      <MatchList>
        {matches.length > 0 ? (
          matches.map((match) => (
            <MatchCard key={match.id}>
              <MatchHeader>
                <OpponentInfo>
                  <OpponentId>{match.opponentId}</OpponentId>
                  <SportBadge>{match.sport}</SportBadge>
                </OpponentInfo>
              </MatchHeader>
              <EloInfo>
                내 Elo: {match.myElo} / 상대 Elo: {match.opponentElo}
              </EloInfo>
              <MatchDetails>
                <ResultInfo>
                  <ResultBadge $isWin={match.isWin}>{match.result}</ResultBadge>
                </ResultInfo>
                <DateText>{match.date}</DateText>
              </MatchDetails>
              <ActionButtons>
                <ActionButton $variant="accept" onClick={() => handleAcceptClick(match.id)}>
                  Accept
                </ActionButton>
                <ActionButton $variant="reject" onClick={() => handleRejectClick(match.id)}>
                  Reject
                </ActionButton>
              </ActionButtons>
            </MatchCard>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>🏓</EmptyIcon>
            <p>신청받은 매치가 없습니다</p>
          </EmptyState>
        )}
      </MatchList>
      {/* Accept 확인 모달 */}
      <TwoButtonModal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        onSubmit={handleAcceptConfirm}
        title="매치 결과 수락"
        content="정말로 이 매치 결과를 수락하시겠습니까?"
        confirmText="수락"
        cancelText="취소"
      />
      {/* Reject 사유 입력 모달 */}
      <TwoButtonModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleRejectConfirm}
        title="매치 결과 거절"
        content={
          <>
            <div>거절 사유를 입력하세요.</div>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{
                width: '100%',
                minHeight: 60,
                marginTop: 12,
                borderRadius: 6,
                border: '1px solid #ddd',
                padding: 8,
                fontSize: 14,
              }}
              placeholder="거절 사유를 입력하세요"
            />
          </>
        }
        confirmText="거절"
        cancelText="취소"
        isLoading={false}
      />
    </>
  );
}
