'use client';

import styled from 'styled-components';
import { useState } from 'react';
import MatchHistory from '@/components/MatchHistory';
import EloTabCards from '@/components/EloTabCards';
import AdBanner from '@/components/AdBanner';
import Image from 'next/image';
import { ICONS } from '@/assets';

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

const sportsOptions = [
  { value: '전체', label: '전체' },
  { value: '바둑', label: '바둑' },
  { value: '체스', label: '체스' },
  { value: '배드민턴', label: '배드민턴' },
  { value: '탁구', label: '탁구' },
  { value: '당구', label: '당구' },
  { value: '테니스', label: '테니스' },
];

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
`;
// 목업 데이터
const historyMatches = [
  {
    id: 3,
    opponentId: 'user789',
    sport: '배드민턴',
    result: '승',
    date: '2024-01-10',
    eloChange: '+15',
    beforeElo: 1305,
    afterElo: 1320,
    opponentBeforeElo: 1280,
    opponentAfterElo: 1265,
    headToHead: {
      wins: 3,
      losses: 2,
    },
    opponentProfileImage: '',
  },

  {
    id: 5,
    opponentId: 'user202',
    sport: '탁구',
    result: '승',
    date: '2024-01-05',
    eloChange: '+8',
    beforeElo: 1308,
    afterElo: 1316,
    opponentBeforeElo: 1275,
    opponentAfterElo: 1267,
    headToHead: {
      wins: 2,
      losses: 1,
    },
    opponentProfileImage: '',
  },
  {
    id: 4,
    opponentId: 'user101',
    sport: '당구',
    result: '패',
    date: '2024-01-08',
    eloChange: '-12',
    beforeElo: 1320,
    afterElo: 1308,
    opponentBeforeElo: 1250,
    opponentAfterElo: 1262,
    headToHead: {
      wins: 1,
      losses: 4,
    },
    opponentProfileImage: '',
  },
  {
    id: 6,
    opponentId: 'user303',
    sport: '체스',
    result: '패',
    date: '2024-01-03',
    eloChange: '-5',
    beforeElo: 1316,
    afterElo: 1311,
    opponentBeforeElo: 1240,
    opponentAfterElo: 1245,
    headToHead: {
      wins: 0,
      losses: 3,
    },
    opponentProfileImage: '',
  },
  {
    id: 7,
    opponentId: 'user404',
    sport: '배드민턴',
    result: '승',
    date: '2024-01-01',
    eloChange: '+10',
    beforeElo: 1311,
    afterElo: 1321,
    opponentBeforeElo: 1230,
    opponentAfterElo: 1240,
    headToHead: {
      wins: 1,
      losses: 0,
    },
    opponentProfileImage: '',
  },
  {
    id: 8,
    opponentId: 'user505',
    sport: '배드민턴',
    result: '패',
    date: '2024-01-01',
    eloChange: '-10',
    beforeElo: 1321,
    afterElo: 1311,
    opponentBeforeElo: 1240,
    opponentAfterElo: 1230,
    headToHead: {
      wins: 0,
      losses: 1,
    },
    opponentProfileImage: '',
  },
];

export default function HistoryPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState('전체');

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport);
    setIsDropdownOpen(false);
  };

  // const handleAdClick = () => {
  //   // 실제로는 광고 링크로 이동하거나 모달을 열 수 있음
  // };

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
              {selectedSport}
              <Image
                src={ICONS.ARROW_DOWN}
                alt="expand"
                width={16}
                height={16}
              />
            </FilterButton>
            <DropdownMenu $isOpen={isDropdownOpen}>
              {sportsOptions.map(option => (
                <DropdownItem
                  key={option.value}
                  onClick={() => handleSportSelect(option.value)}
                >
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </FilterDropdown>
          <SearchContainer>
            <Image src={ICONS.SEARCH} alt="search" width={16} height={16} />
            <input type="text" placeholder="상대유저 검색" />
          </SearchContainer>
        </FilterContainer>
        <MatchHistory matches={historyMatches} />
      </ContentContainer>
    </Container>
  );
}
