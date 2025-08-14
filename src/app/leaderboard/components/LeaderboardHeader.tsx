'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { ICONS } from '@/assets';
import ProfileChip from '@/components/ProfileChip';
import { useCommunityStore } from '@/stores/communityStore';
import { useRouter, useSearchParams } from 'next/navigation';

const HeaderContainer = styled.div`
  // background-color: ${props => props.theme.colors.background};
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
  // background-color: ${props => props.theme.colors.background};
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  transition: all 0.2s;
  cursor: pointer;

  // &:hover {
  //   background-color: ${props => props.theme.colors.backgroundGray};
  // }
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

export default function LeaderboardHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sportOptions } = useCommunityStore();
  const sortedCategories = useMemo(
    () =>
      [...sportOptions].sort(
        (a, b) => (a.value as number) - (b.value as number)
      ),
    [sportOptions]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedLabel = useMemo(() => {
    const urlSport = searchParams?.get('sport');
    const last =
      typeof window !== 'undefined'
        ? localStorage.getItem('leaderboard:lastSportId')
        : null;
    const current =
      urlSport ??
      last ??
      (sortedCategories[0]?.value ? String(sortedCategories[0].value) : '');
    const found = sortedCategories.find(
      opt => String(opt.value) === String(current)
    );
    return found?.label ?? '종목 선택';
  }, [searchParams, sortedCategories]);

  const handleSelect = (id: number) => {
    localStorage.setItem('leaderboard:lastSportId', String(id));
    const params = new URLSearchParams(window.location.search);
    params.set('sport', String(id));
    router.push(`/leaderboard?${params.toString()}`);
    setIsDropdownOpen(false);
  };
  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          <CategoryDropdown ref={dropdownRef}>
            <CategoryButton
              $isOpen={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                  key={String(option.value)}
                  onClick={() => handleSelect(Number(option.value))}
                >
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </CategoryDropdown>
        </LeftSection>

        <RightSection>
          <ProfileChip />
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
}
