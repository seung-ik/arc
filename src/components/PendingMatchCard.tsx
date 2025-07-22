import styled from 'styled-components';
import React from 'react';

const PendingMatchCardWrapper = styled.div`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: ${props => props.theme.spacing.md};
`;

const PendingMatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PendingMatchInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const PendingOpponentId = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.textBlack};
`;

const PendingSportBadge = styled.span`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

const PendingStatus = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: 600;
`;

const PendingResult = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PendingResultBadge = styled.span<{ $isWin: boolean }>`
  background-color: ${props => (props.$isWin ? '#28a745' : '#dc3545')};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: 600;
`;

const PendingDate = styled.span`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
  margin-top: ${props => props.theme.spacing.sm};
`;

const LoadingProgress = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.primaryHover}
  );
  border-radius: 2px;
  animation: loading 2s ease-in-out infinite;

  @keyframes loading {
    0% {
      width: 0%;
      margin-left: 0%;
    }
    50% {
      width: 100%;
      margin-left: 0%;
    }
    100% {
      width: 0%;
      margin-left: 100%;
    }
  }
`;

export interface PendingMatch {
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

interface PendingMatchCardProps {
  match: PendingMatch;
}

const PendingMatchCard: React.FC<PendingMatchCardProps> = ({ match }) => (
  <PendingMatchCardWrapper>
    <PendingMatchHeader>
      <PendingMatchInfo>
        <PendingOpponentId>{match.opponentId}</PendingOpponentId>
        <PendingSportBadge>{match.sport}</PendingSportBadge>
      </PendingMatchInfo>
      <PendingStatus>대기중</PendingStatus>
    </PendingMatchHeader>

    <PendingResult>
      <PendingResultBadge $isWin={match.isWin}>{match.result}</PendingResultBadge>
      <PendingDate>{match.date}</PendingDate>
    </PendingResult>

    <LoadingBar>
      <LoadingProgress />
    </LoadingBar>
  </PendingMatchCardWrapper>
);

export default PendingMatchCard; 