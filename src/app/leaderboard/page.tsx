'use client';
import styled from 'styled-components';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { ICONS } from '@/assets';
import { useCommunityStore } from '@/stores/communityStore';

const HeaderContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-bottom: 5px solid ${props => props.theme.colors.borderLight};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const CategoryDropdown = styled.div`
  position: relative;
  cursor: pointer;
`;

const CategoryButton = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background};
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGray};
  }
`;

const DropdownArrow = styled.span<{ $isOpen: boolean }>`
  transition: transform 0.2s;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-left: 2px;
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: ${props => props.theme.borderRadius.lg};
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transform: translateY(${props => (props.$isOpen ? '0' : '-10px')});
  transition: all 0.2s;
  z-index: 1001;
  margin-top: ${props => props.theme.spacing.xs};
  min-width: 200px;
  padding: ${props => props.theme.spacing.sm} 0;
`;

const DropdownItem = styled.div`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGray};
  }
`;

// 검색 아이콘 제거에 따라 버튼 스타일은 보류

const PageContent = styled.div`
  padding: ${props => props.theme.spacing.md};
`;

const ProfileChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: 9999px;
  background-color: transparent;
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.secondary};
`;

const Nickname = styled.span`
  color: ${props => props.theme.colors.textBlack};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const STORAGE_KEY = 'leaderboard:lastSportId';

export default function LeaderboardPage() {
  // const router = useRouter();
  const { sportOptions } = useCommunityStore();
  const sortedCategories = useMemo(() => {
    return [...sportOptions].sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
  }, [sportOptions]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const last =
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (selectedId == null && sortedCategories.length > 0) {
      const initial = last ? Number(last) : Number(sortedCategories[0].value);
      setSelectedId(initial);
    }
  }, [sortedCategories, selectedId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = useMemo(() => {
    const found = sortedCategories.find(c => Number(c.value) === selectedId);
    return found?.label ?? '종목 선택';
  }, [sortedCategories, selectedId]);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    localStorage.setItem(STORAGE_KEY, String(id));
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <HeaderContainer>
        <HeaderContent>
          <LeftSection>
            <CategoryDropdown ref={dropdownRef}>
              <CategoryButton
                $isOpen={isDropdownOpen}
                onClick={() => setIsDropdownOpen(v => !v)}
              >
                <span>{selectedLabel}</span>
                <DropdownArrow $isOpen={isDropdownOpen}>
                  <Image
                    src={ICONS.ARROW_DOWN}
                    alt="dropdown arrow"
                    width={16}
                    height={16}
                  />
                </DropdownArrow>
              </CategoryButton>
              <DropdownMenu $isOpen={isDropdownOpen}>
                {sortedCategories.map(option => (
                  <DropdownItem
                    key={option.value}
                    onClick={() => handleSelect(Number(option.value))}
                  >
                    {option.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </CategoryDropdown>
          </LeftSection>

          <RightSection>
            <ProfileChip>
              <Avatar />
              <Nickname>닉네임</Nickname>
            </ProfileChip>
          </RightSection>
        </HeaderContent>
      </HeaderContainer>
      <PageContent>
        <div>리더보드</div>
      </PageContent>
    </div>
  );
}
