'use client';

import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';
import { useRouter } from 'next/navigation';
import WriteButton from '@/components/WriteButton';
import { ROUTES } from '@/constants/routes';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  max-width: 768px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: rgb(255, 255, 255);
`;
const ContentWrapper = styled.div`
  flex: 1;
  padding-bottom: 80px; /* BottomNavigation 높이만큼 패딩 */
`;

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleWriteClick = () => {
    console.log('자유글 글쓰기 버튼 클릭됨');
    router.push(`${ROUTES.community.write}?category=badminton`);
  };

  return (
    <LayoutContainer>
      <ContentWrapper>{children}</ContentWrapper>
      <WriteButton onClick={handleWriteClick} />
      <BottomNavigation />
    </LayoutContainer>
  );
}
