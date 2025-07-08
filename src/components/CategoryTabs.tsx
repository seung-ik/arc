'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const CategoryContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: ${(props) => props.theme.spacing.sm} 0;
`;

const TabList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;

  &::-webkit-scrollbar {
    display: none;
  }

  /* 태블릿 이상에서는 중앙 정렬 */
  @media (min-width: 768px) {
    justify-content: center;
  }
`;

const TabItem = styled.li`
  flex-shrink: 0;
  margin: 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  /* 태블릿 이상에서는 구분선 숨김 */
  @media (min-width: 768px) {
    border-bottom: none;
  }
`;

const TabLink = styled.div<{ $isActive: boolean }>`
  display: block;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  text-decoration: none;
  color: ${(props) => (props.$isActive ? props.theme.colors.primary : props.theme.colors.textGray)};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) =>
    props.$isActive
      ? props.theme.typography.fontWeights.medium
      : props.theme.typography.fontWeights.normal};
  border-bottom: 2px solid
    ${(props) => (props.$isActive ? props.theme.colors.primary : 'transparent')};
  transition: all 0.2s;
  white-space: nowrap;
  text-align: center;
  min-width: 70px;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
    min-width: 60px;
    font-size: ${(props) => props.theme.typography.fontSizes.xs};
  }
`;

interface Category {
  id: string;
  label: string;
  path: string;
  order: number;
}

export default function CategoryTabs() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);

  // 현재 카테고리를 pathname에서 추출
  const pathSegments = pathname.split('/');
  const currentCategory = pathSegments.length > 2 ? pathSegments[2] : 'trending';

  useEffect(() => {
    const fetchCategories = async () => {
      const mockCategories: Category[] = [
        { id: 'trending', label: '인기글', path: '/community', order: 1 },
        { id: 'tennis', label: '테니스', path: '/community/tennis', order: 2 },
        { id: 'badminton', label: '배드민턴', path: '/community/badminton', order: 3 },
        { id: 'table-tennis', label: '탁구', path: '/community/table-tennis', order: 4 },
        { id: 'billiards', label: '당구', path: '/community/billiards', order: 5 },
        { id: 'go', label: '바둑', path: '/community/go', order: 6 },
        { id: 'chess', label: '체스', path: '/community/chess', order: 7 },
        { id: 'notice', label: '공지사항', path: '/community/notice', order: 8 },
      ];

      const sortedCategories = mockCategories.sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContainer>
      <TabList>
        {categories.map((category) => (
          <TabItem key={category.id}>
            <Link href={category.path}>
              <TabLink $isActive={currentCategory === category.id}>{category.label}</TabLink>
            </Link>
          </TabItem>
        ))}
      </TabList>
    </CategoryContainer>
  );
}
