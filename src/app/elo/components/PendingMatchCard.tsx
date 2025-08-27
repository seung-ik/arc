'use client';

import styled from 'styled-components';
import React from 'react';
import { MatchResult } from '@/types/match';
import { useTimer } from '@/hooks/useTimer';
import { formatTimeRemaining } from '@/utils';
import ProgressIndicator from '@/components/ProgressIndicator';

const TimerText = styled.div`
  position: absolute;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
`;

// 로우 아이템 스타일드 컴포넌트들
const RowItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
`;

const SportBadge = styled.div`
  background: ${props => props.theme.colors.backgroundGray};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 24px;
  margin-right: ${props => props.theme.spacing.sm};
`;

const ContentSection = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
`;

const UserInfo = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
`;

const StatusBadge = styled.div`
  margin-left: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.primaryLight};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.primary};
`;

// 스포츠별 이모지 매핑
const getSportEmoji = (sport: string) => {
  switch (sport) {
    case '탁구':
      return '🏓';
    case '배드민턴':
      return '🏸';
    case '당구':
      return '🎱';
    case '바둑':
      return '🏁';
    case '테니스':
      return '🎾';
    case '체스':
      return '♟️';
    default:
      return '🏆';
  }
};

interface PendingMatchCardProps {
  match: MatchResult;
}

const PendingMatchCard: React.FC<PendingMatchCardProps> = ({ match }) => {
  const { seconds, progress, color } = useTimer(
    match.expiredTime,
    match.createdAt
  );
  if (match.status === 'expired') return null;

  return (
    <RowItem>
      <SportBadge>{getSportEmoji(match.sportCategoryName)}</SportBadge>
      <ContentSection>
        <UserName>{match.partnerNickname}</UserName>
        <UserInfo>
          {match.senderResult === 'win' ? '승' : '패'} •{' '}
          {new Date(match.createdAt).toLocaleDateString()}
        </UserInfo>
      </ContentSection>
      <ProgressIndicator progress={progress} color={color}>
        <TimerText>{formatTimeRemaining(seconds)}</TimerText>
      </ProgressIndicator>
      <StatusBadge>
        {match.status === 'pending'
          ? '대기중'
          : match.status === 'accepted'
            ? '승인됨'
            : '거부됨'}
      </StatusBadge>
    </RowItem>
  );
};

export default PendingMatchCard;
