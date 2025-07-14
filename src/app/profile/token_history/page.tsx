'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { useWepin } from '@/contexts/WepinContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};
  border-bottom: 1px solid #333;
  background-color: #1a1a1a;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.sm};
  margin-right: ${(props) => props.theme.spacing.md};
  color: #fff;
  transition: color 0.2s;

  &:hover {
    color: #667eea;
  }
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: #fff;
  margin: 0;
`;

const Content = styled.div`
  flex: 1;
  padding: ${(props) => props.theme.spacing.lg};
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const CoinTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: #fff;
  margin: 0;
`;

const TokenCount = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: #667eea;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  background-color: ${(props) => (props.$variant === 'secondary' ? '#2d3748' : '#667eea')};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.$variant === 'secondary' ? '#4a5568' : '#5a67d8')};
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #333;
  margin: ${(props) => props.theme.spacing.lg} 0;
`;

const HistorySection = styled.div`
  margin-top: ${(props) => props.theme.spacing.lg};
`;

const DateGroup = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const DateHeader = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: #888;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm} 0;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.sm} 0;
  margin-bottom: ${(props) => props.theme.spacing.xs};
  border-bottom: 1px solid #333;
`;

const HistoryTitle = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: #fff;
`;

const TokenAmount = styled.div<{ $isPositive: boolean }>`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => (props.$isPositive ? '#48bb78' : '#f56565')};
`;

interface TokenHistoryItem {
  id: number;
  title: string;
  description: string;
  amount: number;
  date: string;
  type: 'earned' | 'spent';
}

// 목업 데이터
const mockTokenHistory: TokenHistoryItem[] = [
  {
    id: 1,
    title: '매치 승리(테니스)',
    description: '',
    amount: 14,
    date: '2024-01-15',
    type: 'earned',
  },
  {
    id: 2,
    title: '닉네임 변경',
    description: '',
    amount: 1,
    date: '2024-01-15',
    type: 'spent',
  },
  {
    id: 3,
    title: '내글 좋아요 수확',
    description: '',
    amount: 8,
    date: '2024-01-14',
    type: 'earned',
  },
  {
    id: 4,
    title: '매치 승리(탁구)',
    description: '',
    amount: 12,
    date: '2024-01-14',
    type: 'earned',
  },
  {
    id: 5,
    title: '글 프로필 노출',
    description: '',
    amount: 1,
    date: '2024-01-13',
    type: 'spent',
  },
  {
    id: 6,
    title: '매치 패배(체스)',
    description: '',
    amount: 5,
    date: '2024-01-13',
    type: 'spent',
  },
];

export default function TokenHistoryPage() {
  const router = useRouter();
  const { isInitialized, isLoggedIn, wepinSDK, login } = useWepin();

  const handleBack = () => {
    router.push(ROUTES.profile.root);
  };

  const handleLearnMore = () => {
    console.log('자세히 알아보기 클릭');
    // 여기에 자세한 설명 모달이나 페이지로 이동
  };

  const handleMyWallet = async () => {
    console.log('handleMyWallet called');
    console.log('isInitialized:', isInitialized);
    console.log('isLoggedIn:', isLoggedIn);
    console.log('wepinSDK:', wepinSDK);
    if (!isInitialized || !wepinSDK) {
      alert('Wepin SDK가 초기화되지 않았습니다.');
      return;
    }
    try {
      if (!isLoggedIn) {
        console.log('Not logged in, calling login()...');
        await login();
      }
      console.log('Calling wepinSDK.openWallet()...');
      await wepinSDK.openWidget();
      console.log('openWallet success!');
    } catch (e) {
      console.error('openWallet error:', e);
      alert('지갑 열기에 실패했습니다.');
    }
  };

  // 날짜별로 그룹화
  const groupedHistory = mockTokenHistory.reduce((groups, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, TokenHistoryItem[]>);

  // 날짜 순으로 정렬
  const sortedDates = Object.keys(groupedHistory).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
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
      return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
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
          <TokenCount>1,250개</TokenCount>
        </TokenHeader>

        <ButtonGroup>
          <ActionButton onClick={handleLearnMore}>자세히 알아보기</ActionButton>
          <ActionButton $variant="secondary" onClick={handleMyWallet}>
            내 지갑
          </ActionButton>
        </ButtonGroup>

        <Divider />

        <HistorySection>
          {sortedDates.map((date) => (
            <DateGroup key={date}>
              <DateHeader>{formatDate(date)}</DateHeader>
              {groupedHistory[date].map((item) => (
                <HistoryItem key={item.id}>
                  <HistoryTitle>{item.title}</HistoryTitle>
                  <TokenAmount $isPositive={item.type === 'earned'}>
                    {item.type === 'earned' ? '+' : '-'}
                    {item.amount}
                  </TokenAmount>
                </HistoryItem>
              ))}
            </DateGroup>
          ))}
        </HistorySection>
      </Content>
    </Container>
  );
}
