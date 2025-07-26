'use client';

import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const SearchHeader = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.backgroundGray};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  cursor: pointer;
  color: ${props => props.theme.colors.textBlack};
  padding: 0;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.textBlack};
  outline: none;

  &::placeholder {
    color: ${props => props.theme.colors.textLightGray};
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  cursor: pointer;
  color: ${props => props.theme.colors.textBlack};
  padding: 0;
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  padding: ${props => props.theme.spacing.md};
`;

const RecentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const RecentTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  margin: 0;
`;

const DeleteAllButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${props => props.theme.colors.textBlack};
  }
`;

const SearchHistoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchHistoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGray};
  }
`;

const SearchHistoryContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  flex: 1;
`;

const ClockIcon = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textLightGray};
`;

const SearchText = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.textBlack};
`;

const SearchHistoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SearchDate = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textLightGray};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textLightGray};
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${props => props.theme.colors.textBlack};
  }
`;

const BottomActions = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.background};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.textGray};
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${props => props.theme.colors.textBlack};
  }
`;

const ActionIcons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const ActionIcon = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid ${props => props.theme.colors.success};
  border-radius: 50%;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.success};

  &:hover {
    background-color: ${props => props.theme.colors.success};
    color: ${props => props.theme.colors.textWhite};
  }
`;

// 최근 검색어 데이터
const mockRecentSearches = [
  { id: 1, text: '산풍기 모타 고장', date: '07.26.' },
  { id: 2, text: '모란기원', date: '07.25.' },
  { id: 3, text: '램투램', date: '07.22.' },
  { id: 4, text: '가산 바버샵', date: '07.12.' },
  { id: 5, text: '오븐마루', date: '07.11.' },
  { id: 6, text: '가산디지털단지역', date: '07.06.' },
  { id: 7, text: '온수역', date: '07.05.' },
  { id: 8, text: '모니터 포장해서 보내는 방법', date: '07.03.' },
  { id: 9, text: '수아당', date: '06.29.' },
  { id: 10, text: '신논현역 햄버거', date: '06.28.' },
  { id: 11, text: '길찾기', date: '06.25.' },
  { id: 12, text: '릴라드', date: '06.20.' },
  { id: 13, text: '지인시어터', date: '06.15.' },
  { id: 14, text: '서울시이사지원금', date: '06.10.' },
];

export default function SearchPage() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(mockRecentSearches);

  // 페이지 로드 시 검색 입력창에 자동 포커스
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 검색어를 최근 검색어에 추가
      const newSearch = {
        id: Date.now(),
        text: searchQuery.trim(),
        date:
          new Date().toLocaleDateString('ko-KR', {
            month: '2-digit',
            day: '2-digit',
          }) + '.',
      };
      setRecentSearches(prev => [
        newSearch,
        ...prev.filter(item => item.text !== searchQuery.trim()),
      ]);

      // 검색 결과 페이지로 이동 (실제로는 검색 API 호출)
      console.log('검색어:', searchQuery);
      // router.push(`/search/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  const handleCancelClick = () => {
    router.back();
  };

  const handleDeleteAll = () => {
    setRecentSearches([]);
  };

  const handleDeleteItem = (id: number) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };

  const handleSearchHistoryClick = (text: string) => {
    setSearchQuery(text);
    // 검색 실행
    console.log('검색어:', text);
    // router.push(`/search/results?q=${encodeURIComponent(text)}`);
  };

  const handleVoiceSearch = () => {
    console.log('음성 검색');
  };

  const handleImageSearch = () => {
    console.log('이미지 검색');
  };

  const handleLocationSearch = () => {
    console.log('위치 검색');
  };

  return (
    <Container>
      <SearchHeader>
        <SearchBar>
          <BackButton onClick={handleBackClick}>←</BackButton>
          <SearchInput
            ref={searchInputRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="검색어 또는 URL 입력"
          />
          <SearchButton onClick={handleSearch}>🔍</SearchButton>
        </SearchBar>
      </SearchHeader>

      <Content>
        <RecentHeader>
          <RecentTitle>최근 검색어</RecentTitle>
          <DeleteAllButton onClick={handleDeleteAll}>전체삭제</DeleteAllButton>
        </RecentHeader>

        <SearchHistoryList>
          {recentSearches.map(item => (
            <SearchHistoryItem key={item.id}>
              <SearchHistoryContent
                onClick={() => handleSearchHistoryClick(item.text)}
              >
                <ClockIcon>🕐</ClockIcon>
                <SearchText>{item.text}</SearchText>
              </SearchHistoryContent>
              <SearchHistoryMeta>
                <SearchDate>{item.date}</SearchDate>
                <DeleteButton onClick={() => handleDeleteItem(item.id)}>
                  ✕
                </DeleteButton>
              </SearchHistoryMeta>
            </SearchHistoryItem>
          ))}
        </SearchHistoryList>
      </Content>

      <BottomActions>
        <CancelButton onClick={handleCancelClick}>취소</CancelButton>
        <ActionIcons>
          <ActionIcon onClick={handleVoiceSearch}>🎤</ActionIcon>
          <ActionIcon onClick={handleImageSearch}>📷</ActionIcon>
          <ActionIcon onClick={handleLocationSearch}>📍</ActionIcon>
        </ActionIcons>
      </BottomActions>
    </Container>
  );
}
