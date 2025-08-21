'use client';

import {
  MatchInfoSection,
  MatchInfoGrid,
  MatchInfoItem,
  MatchInfoLabel,
  MatchInfoValue,
  EloValue,
  ValidityPeriod,
} from '@/styles/PostDetailStyles';

interface MatchInfoProps {
  matchInfo: {
    matchLocation: string;
    myElo: number;
    preferredElo: string;
    status: string;
    participantCount: number;
    createdAt: string;
    deadline: string;
    matchDate: string;
  };
}

export default function MatchInfo({ matchInfo }: MatchInfoProps) {
  // deadline과 현재 시간을 비교하여 유효기간 계산
  const getValidityText = () => {
    const now = new Date();
    const deadline = new Date(matchInfo.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return '유효기간 만료';
    if (diffDays === 1) return '유효기간: 오늘까지';
    return `유효기간: ${diffDays}일 남음`;
  };

  return (
    <>
      <ValidityPeriod>{getValidityText()}</ValidityPeriod>

      <MatchInfoSection>
        <MatchInfoGrid>
          <MatchInfoItem>
            <MatchInfoLabel>ELO</MatchInfoLabel>
            <EloValue>{matchInfo.myElo}</EloValue>
          </MatchInfoItem>

          <MatchInfoItem>
            <MatchInfoLabel>위치</MatchInfoLabel>
            <MatchInfoValue>{matchInfo.matchLocation}</MatchInfoValue>
          </MatchInfoItem>

          <MatchInfoItem>
            <MatchInfoLabel>희망 상대실력</MatchInfoLabel>
            <MatchInfoValue>{matchInfo.preferredElo}</MatchInfoValue>
          </MatchInfoItem>

          <MatchInfoItem>
            <MatchInfoLabel>참가 인원</MatchInfoLabel>
            <MatchInfoValue>{matchInfo.participantCount}명</MatchInfoValue>
          </MatchInfoItem>

          <MatchInfoItem>
            <MatchInfoLabel>상태</MatchInfoLabel>
            <MatchInfoValue>{matchInfo.status}</MatchInfoValue>
          </MatchInfoItem>
        </MatchInfoGrid>
      </MatchInfoSection>
    </>
  );
}
