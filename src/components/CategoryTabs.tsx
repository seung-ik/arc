'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CategoryContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TabList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  justify-content: center;
  align-items: center;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabItem = styled.li`
  flex-shrink: 0;
  margin: 0 4px;
`;

const TabLink = styled(Link)<{ $isActive: boolean }>`
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

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export default function CategoryTabs() {
  const pathname = usePathname();

  // 현재 카테고리를 pathname에서 추출
  const pathSegments = pathname.split('/');
  const currentCategory = pathSegments.length > 2 ? pathSegments[2] : 'all';

  const categories = [
    { id: 'all', label: '전체', path: '/community' },
    { id: 'notice', label: '공지사항', path: '/community/notice' },
    { id: 'free', label: '자유게시판', path: '/community/free' },
    { id: 'qna', label: '질문답변', path: '/community/qna' },
  ];

  return (
    <CategoryContainer>
      <TabList>
        {categories.map((category) => (
          <TabItem key={category.id}>
            <TabLink href={category.path} $isActive={currentCategory === category.id}>
              {category.label}
            </TabLink>
          </TabItem>
        ))}
      </TabList>
    </CategoryContainer>
  );
}
