'use client';

import styled from 'styled-components';
import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import MatchHistory from '../components/MatchHistory';
import EloTabCards from '../components/EloTabCards';
import AdBanner from '@/components/banners/AdBanner';
import Image from 'next/image';
import { ICONS } from '@/assets';
import { createMatchHistoryFetcher } from '@/api/useMatch';
import React from 'react';
import { useCommunityStore } from '@/stores/communityStore';
import { useInfinitePagination } from '@/hooks/useInfinitePagination';
import { MatchHistoryResult } from '@/types/match';
import FirstMatchGuideModal from '@/components/modals/FirstMatchGuideModal';
import { useModal } from '@/hooks/useModal';

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  justify-content: space-between;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 5px 12px 5px 8px;
  background: white;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  width: 200px;
  position: relative;

  input {
    border: none;
    outline: none;
    background: none;
    width: 100%;
    font-size: 14px;
    color: #333;
  }

  &::placeholder {
    color: #6c757d;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FilterDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 20px;
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    color: white;

    img {
      filter: brightness(0) invert(1);
    }
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  margin-top: 4px;
`;

const DropdownItem = styled.button`
  width: 100%;
  min-width: 140px;
  padding: 8px 12px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  position: relative;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
`;

const ContentContainer = styled.div`
  flex: 1;
  width: 100%;
  // padding-top: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.sm};
  display: flex;
  flex-direction: column;
`;

export default function HistoryPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const { sportOptions } = useCommunityStore();
  const firstMatchGuideModal = useModal();

  // 디바운스된 검색 함수 생성 (800ms 지연)
  const debouncedSetSearchTerm = useCallback(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 800),
    []
  );

  // 간단한 무한 스크롤 훅 사용
  const {
    items: matches,
    isLoading,
    hasNext,
    loadMore,
  } = useInfinitePagination<MatchHistoryResult>({
    fetchFunction: createMatchHistoryFetcher(
      selectedSport ? selectedSport.value.toString() : undefined,
      searchTerm || undefined
    ),
    pageSize: 10,
    dependencies: [selectedSport?.value, searchTerm], // 검색어 변경 시에도 초기화
  });

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSportSelect = (
    sport: { value: number; label: string } | null
  ) => {
    setSelectedSport(sport);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 입력창은 즉시 업데이트 (사용자 경험 향상)
    setInputValue(value);
    // API 요청만 디바운스 (300ms 후 실행)
    debouncedSetSearchTerm()(value);
  };

  // 첫 매치 가이드 모달 표시 여부 확인
  useEffect(() => {
    if (matches.length === 0 && !isLoading && selectedSport === null) {
      const today = new Date().toDateString();
      const hiddenDate = localStorage.getItem('firstMatchGuideHidden');

      if (hiddenDate !== today) {
        firstMatchGuideModal.openModal();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches.length, isLoading, selectedSport]);

  return (
    <Container>
      <EloTabCards />
      <AdBanner
        title="기록은 온라인에, 경험은 오프라인에."
        description={`기록은 당신의 이야기를 남기고,\n보상은 더 넓은 경험으로 이어집니다.`}
        badge="할인"
        onClick={() => alert('구장 예약 클릭')}
      />
      <ContentContainer>
        <FilterContainer>
          <FilterDropdown>
            <FilterButton onClick={handleDropdownToggle}>
              {selectedSport ? selectedSport.label : '전체'}
              <Image
                src={ICONS.ARROW_DOWN}
                alt="expand"
                width={16}
                height={16}
              />
            </FilterButton>
            <DropdownMenu $isOpen={isDropdownOpen}>
              <DropdownItem key="전체" onClick={() => handleSportSelect(null)}>
                전체
              </DropdownItem>
              {sportOptions.map(option => (
                <DropdownItem
                  key={option.value}
                  onClick={() => handleSportSelect(option)}
                >
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </FilterDropdown>
          <SearchContainer>
            <Image src={ICONS.SEARCH} alt="search" width={16} height={16} />
            <input
              type="text"
              placeholder="상대유저 검색"
              value={inputValue}
              onChange={handleSearchChange}
            />
          </SearchContainer>
        </FilterContainer>

        <MatchHistory
          matches={matches}
          hasNext={hasNext}
          onLoadMore={loadMore}
          isLoading={isLoading}
        />
      </ContentContainer>

      <FirstMatchGuideModal
        isOpen={firstMatchGuideModal.isOpen}
        onClose={firstMatchGuideModal.closeModal}
      />
    </Container>
  );
}
