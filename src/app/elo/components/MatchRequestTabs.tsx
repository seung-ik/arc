'use client';

import styled from 'styled-components';
import { useState } from 'react';

import {
  useSentMatchResultsApi,
  useReceivedMatchResultsApi,
} from '@/api/useMatch';
import PendingMatchCard from './PendingMatchCard';
import MatchManagement from './MatchManagement';

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

  // API 데이터 가져오기
  const { data: sentMatchesData } = useSentMatchResultsApi();
  const { data: receivedMatchesData } = useReceivedMatchResultsApi();

  // API 데이터 사용
  const pendingMatches =
    sentMatchesData?.data.filter(el => el.status === 'pending') || [];
  const receivedMatches =
    receivedMatchesData?.data.filter(el => el.status === 'pending') || [];

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
                  <PendingMatchCard key={match.id} match={match as any} />
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
              <>
                <MatchManagement matches={receivedMatches as any} />
              </>
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
