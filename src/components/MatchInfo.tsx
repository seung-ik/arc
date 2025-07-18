'use client';

import styled from 'styled-components';
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
  elo?: number;
  location?: string;
  desiredSkillLevel?: string;
  validityPeriod?: number;
}

export default function MatchInfo({
  elo,
  location,
  desiredSkillLevel,
  validityPeriod,
}: MatchInfoProps) {
  const getValidityText = (validityPeriod: number) => {
    if (validityPeriod <= 0) return '유효기간 만료';
    if (validityPeriod === 1) return '유효기간: 오늘까지';
    return `유효기간: ${validityPeriod}일 남음`;
  };

  return (
    <>
      {validityPeriod !== undefined && (
        <ValidityPeriod>{getValidityText(validityPeriod)}</ValidityPeriod>
      )}

      <MatchInfoSection>
        <MatchInfoGrid>
          {elo !== undefined && (
            <MatchInfoItem>
              <MatchInfoLabel>ELO</MatchInfoLabel>
              <EloValue>{elo}</EloValue>
            </MatchInfoItem>
          )}

          {location && (
            <MatchInfoItem>
              <MatchInfoLabel>위치</MatchInfoLabel>
              <MatchInfoValue>{location}</MatchInfoValue>
            </MatchInfoItem>
          )}

          {desiredSkillLevel && (
            <MatchInfoItem>
              <MatchInfoLabel>희망 상대실력</MatchInfoLabel>
              <MatchInfoValue>{desiredSkillLevel}</MatchInfoValue>
            </MatchInfoItem>
          )}
        </MatchInfoGrid>
      </MatchInfoSection>
    </>
  );
}
