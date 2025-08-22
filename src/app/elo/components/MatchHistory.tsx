'use client';

import styled from 'styled-components';
import NoData from '@/components/NoData';
import MatchCardItem from './MatchCardItem';
import LoadMoreButton from '@/components/LoadMoreButton';
import { MatchHistoryResult } from '@/types/match';

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

// NoData 공통 컴포넌트 사용으로 대체

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
        <NoData message="매치 히스토리가 없습니다" />
      )}
    </MatchList>
  );
}
