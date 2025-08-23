'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { MatchResult } from '@/types/match';
import MatchRow from './MatchRow';

interface MatchManagementProps {
  matches: MatchResult[];
}

export default function MatchManagement({ matches }: MatchManagementProps) {
  const router = useRouter();

  const handleOpponentClick = (opponentId: string) => {
    router.push(ROUTES.profile.user(opponentId));
  };

  return (
    <>
      <div>
        {matches.map(match => (
          <MatchRow
            key={match.id}
            match={match}
            onOpponentClick={handleOpponentClick}
          />
        ))}
      </div>
    </>
  );
}
