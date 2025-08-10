'use client';

import styled from 'styled-components';
import MatchCardItem from './MatchCardItem';

interface HistoryMatch {
  id: number;
  partner: number;
  partner_nickname: string;
  sportCategory: string;
  result: 'win' | 'lose' | 'draw';
  isHandicap: boolean;
  created_at: string;
  elo_before: number;
  elo_after: number;
  elo_delta: number;
}

interface MatchHistoryProps {
  matches: HistoryMatch[];
  hasNext?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const LoadMoreButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background 0.2s;
  margin-top: ${props => props.theme.spacing.md};

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    background: ${props => props.theme.colors.textGray};
    cursor: not-allowed;
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

export default function MatchHistory({
  matches,
  hasNext,
  onLoadMore,
  isLoading,
}: MatchHistoryProps) {
  return (
    <MatchList>
      {matches.length > 0 ? (
        <>
          {matches.map(match => (
            <MatchCardItem key={match.id} match={match} />
          ))}
          {hasNext && (
            <LoadMoreButton onClick={onLoadMore} disabled={isLoading}>
              {isLoading ? '로딩 중...' : '더보기'}
            </LoadMoreButton>
          )}
        </>
      ) : (
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <p>매치 히스토리가 없습니다</p>
        </EmptyState>
      )}
    </MatchList>
  );
}
