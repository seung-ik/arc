'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { useWepin } from '@/contexts/WepinContext';
import { useInfiniteTokenTransactions } from '@/api/useTokenHistory';
import { useAuthStore } from '@/stores/authStore';
import InfiniteScrollObserver from '@/components/views/InfiniteScrollObserver';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid #333;
  background-color: #1a1a1a;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  margin-right: ${props => props.theme.spacing.md};
  color: #fff;
  transition: color 0.2s;

  &:hover {
    color: #667eea;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: #fff;
  margin: 0;
`;

const Content = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CoinTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: #fff;
  margin: 0;
`;

const TokenCount = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: #667eea;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  background-color: ${props =>
    props.$variant === 'secondary' ? '#2d3748' : '#667eea'};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props =>
      props.$variant === 'secondary' ? '#4a5568' : '#5a67d8'};
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #333;
  margin: ${props => props.theme.spacing.lg} 0;
`;

const HistorySection = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
`;

const DateGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DateHeader = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: #888;
  margin-bottom: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} 0;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  margin-bottom: ${props => props.theme.spacing.xs};
  border-bottom: 1px solid #333;
`;

const HistoryTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: #fff;
`;

const TokenAmount = styled.div<{ $isPositive: boolean }>`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => (props.$isPositive ? '#48bb78' : '#f56565')};
`;

export default function TokenHistoryPage() {
  const router = useRouter();
  const { isInitialized, isLoggedIn, wepinSDK, loginByWepin } = useWepin();
  const { userProfile } = useAuthStore();

  // 인피니트 스크롤 훅 사용
  const {
    data: tokenTransactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTokenTransactions(20);

  // 날짜별로 그룹화 (실제 API 데이터 사용 - 인피니트 스크롤)
  const groupedHistory = (() => {
    const allTransactions =
      tokenTransactions?.pages?.flatMap(page => page.data.transactions || []) ||
      [];

    return allTransactions.reduce(
      (groups: Record<string, any[]>, transaction: any) => {
        const date = new Date(transaction.processedAt)
          .toISOString()
          .split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }

        // API 데이터를 UI에 맞는 형태로 변환
        const historyItem = {
          id: transaction.id,
          title: transaction.summary.action,
          description: transaction.summary.reason,
          amount: Math.abs(
            transaction.metadata.balance_after -
              transaction.metadata.balance_before
          ),
          date: date,
          type: transaction.summary.direction === 'earned' ? 'earned' : 'spent',
          transaction: transaction, // 원본 데이터도 보관
        };

        groups[date].push(historyItem);
        return groups;
      },
      {} as Record<string, any[]>
    );
  })();

  // 날짜 순으로 정렬
  const sortedDates = Object.keys(groupedHistory).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const handleBack = () => {
    router.push(ROUTES.profile.root);
  };

  const handleLearnMore = () => {
    // 여기에 자세한 설명 모달이나 페이지로 이동
  };

  const handleMyWallet = async () => {
    if (!isInitialized || !wepinSDK) {
      alert('Wepin SDK가 초기화되지 않았습니다.');
      return;
    }
    try {
      if (!isLoggedIn) {
        await loginByWepin();
      }
      await wepinSDK.openWidget();
    } catch (e) {
      console.error(e);
      alert('지갑 열기에 실패했습니다.');
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>←</BackButton>
        <Title>토큰 내역</Title>
      </Header>

      <Content>
        <TokenHeader>
          <CoinTitle>보유 토큰</CoinTitle>
          <TokenCount>
            {Number(userProfile?.tokenAmount || 0).toLocaleString()} EXP
          </TokenCount>
        </TokenHeader>

        <ButtonGroup>
          <ActionButton onClick={handleLearnMore}>자세히 알아보기</ActionButton>
          <ActionButton $variant="secondary" onClick={handleMyWallet}>
            내 지갑
          </ActionButton>
        </ButtonGroup>

        <Divider />

        <HistorySection>
          {sortedDates.map(date => (
            <DateGroup key={date}>
              <DateHeader>{formatDate(date)}</DateHeader>
              {groupedHistory[date]?.map((item: any) => (
                <HistoryItem key={item.id}>
                  <div style={{ flex: 1 }}>
                    <HistoryTitle>
                      {item.transaction.summary.action}
                    </HistoryTitle>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#888',
                        marginTop: '4px',
                      }}
                    >
                      {item.transaction.summary.target} •{' '}
                      {item.transaction.summary.reason}
                    </div>
                  </div>
                  <TokenAmount
                    $isPositive={
                      item.transaction.summary.direction === 'earned'
                    }
                  >
                    {item.transaction.summary.direction === 'earned'
                      ? '+'
                      : '-'}
                    {item.transaction.summary.amount}
                  </TokenAmount>
                </HistoryItem>
              ))}
            </DateGroup>
          ))}

          {/* 인피니트 스크롤 옵저버 */}
          <InfiniteScrollObserver
            onIntersect={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            loadingText="더 많은 토큰 내역을 불러오는 중..."
          />
        </HistorySection>
      </Content>
    </Container>
  );
}
