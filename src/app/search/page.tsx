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

// 최근 검색어 데이터
const mockRecentSearches = [
  { id: 1, text: '테니스 코트 예약', date: '07.26.' },
  { id: 2, text: '배드민턴 대회', date: '07.25.' },
  { id: 3, text: '체스 강사', date: '07.22.' },
  { id: 4, text: '탁구 친구', date: '07.12.' },
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

  const handleDeleteAll = () => {
    setRecentSearches([]);
  };

  const handleDeleteItem = (id: number) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };

  const handleSearchHistoryClick = (text: string) => {
    setSearchQuery(text);
    // 검색 실행
    // router.push(`/search/results?q=${encodeURIComponent(text)}`);
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
    </Container>
  );
}
