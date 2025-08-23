'use client';

import styled from 'styled-components';
import { Suspense } from 'react';
import { BUSINESS_IMAGES } from '@/assets';
import LeaderboardHeader from './components/LeaderboardHeader';
import HighRankerSection from './components/HighRankerSection';
import MySummaryCards from './components/MySummaryCards';
import RankListSection from './components/RankListSection';

const PageContent = styled.div`
  padding: ${props => props.theme.spacing.md};
`;

const RotatingBanner = styled.div`
  background: #000;
  color: white;
  padding: ${props => props.theme.spacing.sm} 0;
  text-align: center;
  font-weight: 300;
  font-size: ${props => props.theme.typography.fontSizes.base};
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25vw;
  width: 100%;
`;

const BannerText = styled.span`
  flex-shrink: 0;
`;

// Top 섹션 스타일
const Section = styled.section`
  margin-top: ${props => props.theme.spacing.lg};
  & + & {
    margin-top: ${props => props.theme.spacing.xl};
  }
`;

// 섹션 3 스타일은 components/RankListSection.tsx로 이동

// 배너 스타일
const PromoBanner = styled.div`
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #6c5ce7, #74b9ff);
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textWhite};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.md};
  }
`;

const BannerTitle = styled.h3`
  margin: 0;
  font-size: clamp(1rem, 4.5vw, 1.5rem);
  line-height: 1.2;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const BannerSubtitle = styled.p`
  margin: 0;
  font-size: clamp(0.75rem, 3.5vw, 0.875rem);
  line-height: 1.4;
  opacity: 0.9;
`;

const BannerCTA = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: ${props => props.theme.colors.textWhite};
  border-radius: 9999px;
  padding: 8px 14px;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};

  @media (max-width: 520px) {
    align-self: stretch;
    text-align: center;
    width: 100%;
    padding: 10px 16px;
  }
`;

// 섹션 2 스타일은 components/MySummaryCards.tsx로 이동

const HIGH_RANKERS = [
  {
    id: 1,
    rank: 1,
    name: '닉네임1',
    elo: '1.1K',
    games: 10,
    avatarUrl: BUSINESS_IMAGES.PEOPLE_01.src,
  },
  {
    id: 2,
    rank: 2,
    name: '닉네임2',
    elo: '1.2K',
    games: 20,
    avatarUrl: BUSINESS_IMAGES.PEOPLE_02.src,
  },
  {
    id: 3,
    rank: 3,
    name: '닉네임3',
    elo: '1.3K',
    games: 30,
    avatarUrl: BUSINESS_IMAGES.PEOPLE_03.src,
  },
  {
    id: 4,
    rank: 4,
    name: '닉네임4',
    elo: '970',
    games: 20,
    avatarUrl: BUSINESS_IMAGES.PEOPLE_04.src,
  },
  {
    id: 5,
    rank: 5,
    name: '닉네임5',
    elo: '960',
    games: 25,
    avatarUrl: BUSINESS_IMAGES.PEOPLE_05.src,
  },
  {
    id: 6,
    rank: 6,
    name: '닉네임6',
    elo: '950',
    games: 30,
    avatarUrl: BUSINESS_IMAGES.PEOPLE_06.src,
  },
  {
    id: 7,
    rank: 7,
    name: '닉네임7',
    elo: '940',
    games: 35,
    avatarUrl: BUSINESS_IMAGES.PEOPLE_07.src,
  },
];

export default function LeaderboardPage() {
  return (
    <div>
      <RotatingBanner>
        <BannerText>준비 중인 페이지입니다 🚧</BannerText>
      </RotatingBanner>
      <Suspense fallback={null}>
        <LeaderboardHeader />
      </Suspense>
      <PageContent>
        <Section>
          <HighRankerSection rankers={HIGH_RANKERS} />
        </Section>
        <Section>
          <MySummaryCards />
        </Section>

        {/* 섹션 3: Top 4–100 리스트 (목업) */}
        <Section>
          <RankListSection />
        </Section>

        <Section>
          <PromoBanner>
            <BannerText>
              <BannerTitle>커뮤니티에서 활동하고 보상을 받으세요</BannerTitle>
              <BannerSubtitle>
                인기글에 참여하고 토큰 리워드를 확보하세요
              </BannerSubtitle>
            </BannerText>
            <BannerCTA>지금 참여하기</BannerCTA>
          </PromoBanner>
        </Section>
      </PageContent>
    </div>
  );
}
