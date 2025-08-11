'use client';

import styled from 'styled-components';
import MatchCardItem from './MatchCardItem';
import LoadMoreButton from '@/components/LoadMoreButton';
import { MatchHistoryResult } from '@/api/useMatch';

interface MatchHistoryProps {
  matches: MatchHistoryResult[];
  hasNext?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textGray};
  text-align: center;
  flex: 1;
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
          {hasNext && onLoadMore && (
            <LoadMoreButton onClick={onLoadMore} isLoading={isLoading}>
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
