'use client';

import styled from 'styled-components';
import React from 'react';

// 시계형 원형 프로그레스 바 컴포넌트
const CircularProgress = styled.div<{ $progress: number; $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => props.$color} 0deg ${props => props.$progress}deg,
    ${props => props.theme.colors.backgroundGray} ${props => props.$progress}deg
      360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.theme.colors.background};
  }
`;

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
  margin-left: ${props => props.theme.spacing.sm};
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

// 타이머 계산 함수
const calculateTimeRemaining = (
  createdAt: number
): { hours: number; minutes: number; progress: number; color: string } => {
  const now = Date.now();
  const elapsed = now - createdAt;
  const totalTime = 12 * 60 * 60 * 1000; // 12시간을 밀리초로
  const remaining = totalTime - elapsed;

  if (remaining <= 0) {
    return { hours: 0, minutes: 0, progress: 360, color: '#dc3545' }; // 빨간색
  }

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const progress = (elapsed / totalTime) * 360;

  let color = '#28a745'; // 초록색
  if (progress > 240) {
    // 8시간 이상 경과
    color = '#ffc107'; // 노란색
  }
  if (progress > 330) {
    // 11시간 이상 경과
    color = '#dc3545'; // 빨간색
  }

  return { hours, minutes, progress, color };
};

export interface PendingMatch {
  id: number;
  opponentId: string;
  sport: string;
  result: string;
  date: string;
  isWin: boolean;
  myElo: number;
  opponentElo: number;
  createdAt: number;
}

interface PendingMatchCardProps {
  match: PendingMatch;
}

const PendingMatchCard: React.FC<PendingMatchCardProps> = ({ match }) => {
  const { hours, minutes, progress, color } = calculateTimeRemaining(
    match.createdAt
  );

  return (
    <RowItem>
      <SportBadge>{getSportEmoji(match.sport)}</SportBadge>
      <ContentSection>
        <UserName>{match.opponentId}</UserName>
        <UserInfo>
          {match.result} • {match.date}
        </UserInfo>
      </ContentSection>
      <CircularProgress $progress={progress} $color={color}>
        <TimerText>{`${hours}:${minutes.toString().padStart(2, '0')}`}</TimerText>
      </CircularProgress>
      <StatusBadge>대기중</StatusBadge>
    </RowItem>
  );
};

export default PendingMatchCard;
