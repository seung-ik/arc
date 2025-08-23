'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { MatchResult } from '@/types/match';
import MatchRow from './MatchRow';

interface MatchManagementProps {
  matches: MatchResult[];
}

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

// calculateTimeRemaining 함수 제거 - useTimer 훅으로 대체

export default function MatchManagement({ matches }: MatchManagementProps) {
  const router = useRouter();

  const handleOpponentClick = (opponentId: string) => {
    router.push(ROUTES.profile.user(opponentId));
  };

  return (
    <>
      <div>
        {matches.length > 0 ? (
          matches.map(match => (
            <MatchRow
              key={match.id}
              match={match}
              onOpponentClick={handleOpponentClick}
            />
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <p>처리할 매치가 없습니다</p>
          </EmptyState>
        )}
      </div>
    </>
  );
}
