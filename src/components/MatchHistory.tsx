'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

interface HistoryMatch {
  id: number;
  opponentId: string;
  sport: string;
  result: string;
  date: string;
  eloChange: string;
  beforeElo: number;
  afterElo: number;
}

interface MatchHistoryProps {
  matches: HistoryMatch[];
}

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const MatchCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const OpponentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const OpponentId = styled.button`
  font-weight: 600;
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

const SportBadge = styled.span`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

const MatchDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ResultInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ResultBadge = styled.span<{ $isWin: boolean }>`
  background-color: ${props => (props.$isWin ? '#28a745' : '#dc3545')};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: 600;
`;

const EloChange = styled.span<{ $isPositive: boolean }>`
  color: ${props => (props.$isPositive ? '#28a745' : '#dc3545')};
  font-weight: 600;
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

const DateText = styled.span`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.xs};
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

const EloInfo = styled.div`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

export default function MatchHistory({ matches }: MatchHistoryProps) {
  const router = useRouter();

  const handleOpponentClick = (opponentId: string) => {
    router.push(ROUTES.profile.user(opponentId));
  };

  return (
    <MatchList>
      {matches.length > 0 ? (
        matches.map(match => (
          <MatchCard key={match.id}>
            <MatchHeader>
              <OpponentInfo>
                <OpponentId
                  onClick={() => handleOpponentClick(match.opponentId)}
                >
                  {match.opponentId}
                </OpponentId>
                <SportBadge>{match.sport}</SportBadge>
              </OpponentInfo>
            </MatchHeader>
            <EloInfo>
              내 Elo: {match.beforeElo} → {match.afterElo} (
              <EloChange $isPositive={match.eloChange.startsWith('+')}>
                {match.eloChange}
              </EloChange>
              )
            </EloInfo>
            <MatchDetails>
              <ResultInfo>
                <ResultBadge $isWin={match.result === '승'}>
                  {match.result}
                </ResultBadge>
              </ResultInfo>
              <DateText>{match.date}</DateText>
            </MatchDetails>
          </MatchCard>
        ))
      ) : (
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <p>매치 히스토리가 없습니다</p>
        </EmptyState>
      )}
    </MatchList>
  );
}
