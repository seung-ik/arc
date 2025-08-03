'use client';

import styled from 'styled-components';
import MatchCardItem from './MatchCardItem';

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

export default function MatchHistory({ matches }: MatchHistoryProps) {
  return (
    <MatchList>
      {matches.length > 0 ? (
        matches.map(match => <MatchCardItem key={match.id} match={match} />)
      ) : (
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <p>매치 히스토리가 없습니다</p>
        </EmptyState>
      )}
    </MatchList>
  );
}
