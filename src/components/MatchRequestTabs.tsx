'use client';

import styled from 'styled-components';
import { useState } from 'react';
import PendingMatchCard from './PendingMatchCard';
import MatchManagement from './MatchManagement';

interface Match {
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

const MatchRequestSection = styled.div`
  margin: ${props => props.theme.spacing.md} 0;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  // 배너와 추천매치 사이 구분점 역할
  border: 1px solid ${props => props.theme.colors.borderLight};
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${props => props.theme.spacing.sm};
  background: ${props =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => (props.$active ? 'white' : props.theme.colors.textGray)};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  position: relative;
  z-index: 20; // RegisterWrapper의 z-index: 10보다 높게 설정

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primary
        : props.theme.colors.backgroundGray};
  }
`;

const TabContent = styled.div`
  padding: ${props => props.theme.spacing.md};
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textGray};
  gap: ${props => props.theme.spacing.md};
`;

const EmptyIcon = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: ${props => props.theme.colors.backgroundGray};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  flex-shrink: 0;
`;

const EmptyText = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.error};
  text-align: center;
`;

const EmptySubText = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
  text-align: center;
`;

export default function MatchRequestTabs() {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  // 목업 데이터
  const pendingMatches: Match[] = [
    {
      id: 1,
      opponentId: 'user123',
      sport: '배드민턴',
      result: '승',
      date: '2025-07-30',
      isWin: true,
      myElo: 1300,
      opponentElo: 1280,
      createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2시간 전
    },
  ];

  const receivedMatches: Match[] = [
    {
      id: 2,
      opponentId: 'user456',
      sport: '탁구',
      result: '승',
      date: '2024-01-15',
      isWin: true,
      myElo: 1320,
      opponentElo: 1280,
      createdAt: Date.now() - 10 * 60 * 60 * 1000, // 10시간 전
    },
  ];

  const handleAccept = (matchId: number) => {
    console.log('Accept match:', matchId);
  };

  const handleReject = (matchId: number, reason?: string) => {
    console.log('Reject match:', matchId, reason);
  };

  return (
    <MatchRequestSection>
      <TabContainer>
        <TabButton
          $active={activeTab === 'sent'}
          onClick={() => setActiveTab('sent')}
        >
          보낸 요청 ({pendingMatches.length})
        </TabButton>
        <TabButton
          $active={activeTab === 'received'}
          onClick={() => setActiveTab('received')}
        >
          받은 요청 ({receivedMatches.length})
        </TabButton>
      </TabContainer>

      <TabContent>
        {activeTab === 'sent' && (
          <>
            {pendingMatches.length > 0 ? (
              <div>
                {pendingMatches.map(match => (
                  <PendingMatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <EmptyState>
                <EmptyIcon>📤</EmptyIcon>
                <div style={{ flex: 1 }}>
                  <EmptyText>보낸 요청이 없습니다</EmptyText>
                  <EmptySubText>
                    내가 활동한 매치 결과를 입력해보세요
                  </EmptySubText>
                </div>
              </EmptyState>
            )}
          </>
        )}

        {activeTab === 'received' && (
          <>
            {receivedMatches.length > 0 ? (
              <MatchManagement
                matches={receivedMatches}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ) : (
              <EmptyState>
                <EmptyIcon>📥</EmptyIcon>
                <div style={{ flex: 1 }}>
                  <EmptyText>받은 요청이 없습니다</EmptyText>
                  <EmptySubText>다른 사용자의 요청을 기다려보세요</EmptySubText>
                </div>
              </EmptyState>
            )}
          </>
        )}
      </TabContent>
    </MatchRequestSection>
  );
}
