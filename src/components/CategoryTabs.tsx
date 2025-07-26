'use client';

import styled from 'styled-components';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ROUTES } from '@/constants/routes';

const HeaderContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  position: sticky;
  top: 0;
  z-index: 1000;
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
  transform: rotate(${props => (props.$isOpen ? '90deg' : '-90deg')});
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
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

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s;
  color: ${props => props.theme.colors.textBlack};

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGray};
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: ${props => props.theme.colors.error};
  border-radius: 50%;
`;

const NotificationContainer = styled.div`
  position: relative;
`;

interface Category {
  id: string;
  label: string;
  path: string;
  order: number;
}

export default function CategoryTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 현재 카테고리를 pathname에서 추출
  const pathSegments = pathname.split('/');
  const currentCategory =
    pathSegments.length > 2 ? pathSegments[2] : 'trending';

  useEffect(() => {
    const fetchCategories = async () => {
      const mockCategories: Category[] = [
        {
          id: 'trending',
          label: '자유글',
          path: ROUTES.community.root,
          order: 1,
        },
        {
          id: 'tennis',
          label: '테니스',
          path: ROUTES.community.tennis,
          order: 2,
        },
        {
          id: 'badminton',
          label: '배드민턴',
          path: ROUTES.community.badminton,
          order: 3,
        },
        {
          id: 'table-tennis',
          label: '탁구',
          path: ROUTES.community.tableTennis,
          order: 4,
        },
        {
          id: 'billiards',
          label: '당구',
          path: ROUTES.community.billiards,
          order: 5,
        },
        { id: 'go', label: '바둑', path: ROUTES.community.go, order: 6 },
        { id: 'chess', label: '체스', path: ROUTES.community.chess, order: 7 },
        {
          id: 'notice',
          label: '공지사항',
          path: ROUTES.community.notice,
          order: 8,
        },
      ];

      const sortedCategories = mockCategories.sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
    };

    fetchCategories();
  }, []);

  // 현재 선택된 카테고리 라벨 찾기
  const currentCategoryLabel =
    categories.find(cat => cat.id === currentCategory)?.label || '자유글';

  // 드롭다운 외부 클릭 시 닫기
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (category: Category) => {
    router.push(category.path);
    setIsDropdownOpen(false);
  };

  const handleSearchClick = () => {
    router.push('/search');
  };

  const handleNotificationClick = () => {
    console.log('알림 클릭');
    // 알림 페이지로 이동하거나 알림 모달을 열 수 있음
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
              {currentCategoryLabel}
              <DropdownArrow $isOpen={isDropdownOpen}>‹</DropdownArrow>
            </CategoryButton>
            <DropdownMenu $isOpen={isDropdownOpen}>
              {categories.map(category => (
                <DropdownItem
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.label}
                  {category.id === 'notice' && ' *'}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </CategoryDropdown>
        </LeftSection>

        <RightSection>
          <IconButton onClick={handleSearchClick}>🔍</IconButton>
          <NotificationContainer>
            <IconButton onClick={handleNotificationClick}>🔔</IconButton>
            <NotificationBadge />
          </NotificationContainer>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
}
