'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { BUSINESS_IMAGES } from '@/assets';
import { StaticImageData } from 'next/image';

interface Business {
  id: number;
  name: string;
  image: StaticImageData;
  category: string;
  location: string;
  description: string;
}

interface BusinessBannerProps {
  onClick?: (business: Business) => void;
}

const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 130px;
  overflow: hidden;
  margin: ${props => props.theme.spacing.md} 0;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
`;

const ScrollContainer = styled.div<{ $translateX: number }>`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transform: translateX(${props => props.$translateX}px);
  transition: transform 0.5s ease-in-out;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.xs};
  gap: 4px;
`;

const BusinessCard = styled.div<{ $isActive: boolean }>`
  min-width: 120px;
  height: 100%;
  background-color: white;
  padding: ${props => props.theme.spacing.xs};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  transform: ${props => (props.$isActive ? 'scale(1.08)' : 'scale(1)')};

  &:hover {
    transform: ${props => (props.$isActive ? 'scale(1.1)' : 'scale(1.02)')};
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -2px;
    top: 20%;
    bottom: 20%;
    width: 1px;
    background-color: #c0c0c0;
  }
`;

const BusinessImage = styled.div<{
  $imageUrl: StaticImageData;
  $isActive: boolean;
}>`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-image: url(${props => props.$imageUrl.src});
  background-size: cover;
  background-position: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  flex-shrink: 0;
  border: ${props =>
    props.$isActive
      ? '3px solid black'
      : `1px solid ${props.theme.colors.borderLight}`};

  transition: all 0.2s ease;
`;

const AddButton = styled.button`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  line-height: 1;
  padding: 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
`;

const BusinessName = styled.h4`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  text-align: center;
  line-height: 1.2;
`;

const BusinessLocation = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
  text-align: center;
`;

// 임시 업장 데이터 (실제로는 API에서 가져올 예정)
const mockBusinesses: Business[] = [
  {
    id: 1,
    name: '강남 테니스장',
    image: BUSINESS_IMAGES.EX_1,
    category: '테니스',
    location: '서울 강남구',
    description: '최신 시설의 실내 테니스장',
  },
  {
    id: 2,
    name: '송파 탁구클럽',
    image: BUSINESS_IMAGES.EX_3,
    category: '탁구',
    location: '서울 송파구',
    description: '전문 코치가 있는 탁구장',
  },
  {
    id: 3,
    name: '종로 기원',
    image: BUSINESS_IMAGES.EX_5,
    category: '바둑',
    location: '서울 종로구',
    description: '전통적인 바둑 문화 공간',
  },
  {
    id: 4,
    name: '홍대 체스카페',
    image: BUSINESS_IMAGES.EX_6,
    category: '체스',
    location: '서울 마포구',
    description: '체스와 커피를 함께 즐기는 공간',
  },
  {
    id: 5,
    name: '부산 당구장',
    image: BUSINESS_IMAGES.EX_4,
    category: '당구',
    location: '부산 해운대구',
    description: '바다가 보이는 당구장',
  },
  {
    id: 6,
    name: '대구 테니스클럽',
    image: BUSINESS_IMAGES.EX_1,
    category: '테니스',
    location: '대구 수성구',
    description: '야외 테니스 코트 운영',
  },
  {
    id: 7,
    name: '인천 탁구센터',
    image: BUSINESS_IMAGES.EX_3,
    category: '탁구',
    location: '인천 연수구',
    description: '대회 개최 가능한 대형 탁구장',
  },
  {
    id: 8,
    name: '광주 바둑학원',
    image: BUSINESS_IMAGES.EX_6,
    category: '바둑',
    location: '광주 서구',
    description: '초급부터 고급까지 체계적 교육',
  },
];

const BusinessBanner: React.FC<BusinessBannerProps> = ({ onClick }) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startTranslateX, setStartTranslateX] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const router = useRouter();

  // 현재 보이는 카드 인덱스 계산 (두 번째 카드에 활성 효과)
  const getCurrentActiveIndex = () => {
    const cardWidth = 120 + 4; // 카드 너비 + gap
    const currentIndex = Math.abs(Math.round(translateX / cardWidth));
    return (currentIndex + 1) % mockBusinesses.length; // +1로 두 번째 카드에 활성 효과
  };

  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setTranslateX(prev => {
        const cardWidth = 120 + 4; // 카드 너비 + gap
        const nextTranslate = prev - cardWidth;

        // 5번 반복된 배열에서 2번째 세트가 끝날 때 처음으로 순간이동
        if (nextTranslate <= -(mockBusinesses.length * 2 * cardWidth)) {
          return 0;
        }
        return nextTranslate;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoScrolling(false);
    setStartX(e.clientX);
    setStartTranslateX(translateX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    let newTranslateX = startTranslateX + deltaX;

    // 무한 루프 구현: 양 끝에서 순환
    const cardWidth = 120 + 4;
    const totalWidth = mockBusinesses.length * cardWidth;

    if (newTranslateX > 0) {
      newTranslateX = newTranslateX - totalWidth;
    } else if (newTranslateX < -(totalWidth * 3)) {
      newTranslateX = newTranslateX + totalWidth;
    }

    setTranslateX(newTranslateX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // 2초 후 자동 스크롤 재개
    setTimeout(() => setIsAutoScrolling(true), 2000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoScrolling(false);
    setStartX(e.touches[0].clientX);
    setStartTranslateX(translateX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    let newTranslateX = startTranslateX + deltaX;

    // 무한 루프 구현: 양 끝에서 순환
    const cardWidth = 120 + 4;
    const totalWidth = mockBusinesses.length * cardWidth;

    if (newTranslateX > 0) {
      newTranslateX = newTranslateX - totalWidth;
    } else if (newTranslateX < -(totalWidth * 3)) {
      newTranslateX = newTranslateX + totalWidth;
    }

    setTranslateX(newTranslateX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // 2초 후 자동 스크롤 재개
    setTimeout(() => setIsAutoScrolling(true), 2000);
  };

  const handleCardClick = (business: Business) => {
    if (isDragging) return; // 드래그 중일 때는 클릭 무시

    if (onClick) {
      onClick(business);
    } else {
      // 기본 동작: 업장 상세 페이지로 이동
      router.push(`/business/${business.id}`);
    }
  };

  // 카드들을 여러 번 복제해서 무한 루프 효과 생성
  const duplicatedBusinesses = [
    ...mockBusinesses,
    ...mockBusinesses,
    ...mockBusinesses,
    ...mockBusinesses,
    ...mockBusinesses,
  ];

  return (
    <BannerContainer>
      <ScrollContainer
        $translateX={translateX}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {duplicatedBusinesses.map((business, index) => {
          const originalIndex = index % mockBusinesses.length;
          const isActive = originalIndex === getCurrentActiveIndex();

          return (
            <BusinessCard
              key={`${business.id}-${index}`}
              $isActive={isActive}
              onClick={() => handleCardClick(business)}
            >
              <BusinessImage $imageUrl={business.image} $isActive={isActive}>
                <AddButton
                  onClick={e => {
                    e.stopPropagation();
                    alert('구장 홍보페이지 연결 준비중입니다');
                  }}
                >
                  +
                </AddButton>
              </BusinessImage>
              <BusinessName>{business.name}</BusinessName>
              <BusinessLocation>{business.location}</BusinessLocation>
            </BusinessCard>
          );
        })}
      </ScrollContainer>
    </BannerContainer>
  );
};

export default BusinessBanner;
