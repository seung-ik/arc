'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// import { useRouter } from 'next/navigation';
import { ICONS, BUSINESS_IMAGES } from '@/assets';
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
  max-width: clamp(100px, 30vw, 200px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const STORAGE_KEY = 'leaderboard:lastSportId';

// Top 섹션 스타일
const Section = styled.section`
  margin-top: ${props => props.theme.spacing.lg};
  & + & {
    margin-top: ${props => props.theme.spacing.xl};
  }
`;

// 섹션 타이틀은 시각적으로 불필요하여 제거

const TopRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 3.5vw, 16px);
`;

const Row = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  gap: clamp(8px, 2.5vw, 16px);
`;

const AvatarCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: clamp(72px, 20vw, 112px);
`;

const AvatarWrapper = styled.div<{ $size: 'lg' | 'md' }>`
  position: relative;
  width: ${props =>
    props.$size === 'lg'
      ? 'clamp(72px, 20vw, 112px)'
      : 'clamp(52px, 15vw, 84px)'};
  height: ${props =>
    props.$size === 'lg'
      ? 'clamp(72px, 20vw, 112px)'
      : 'clamp(52px, 15vw, 84px)'};
`;

const AvatarCircle = styled.div<{
  $size: 'lg' | 'md';
  $rank: number;
  $img?: string;
}>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.backgroundGray};
  background-image: ${props => (props.$img ? `url(${props.$img})` : 'none')};
  background-size: cover;
  background-position: center;
  border: 4px solid
    ${props =>
      props.$rank === 1
        ? '#FFD700'
        : props.$rank === 2
          ? '#C0C0C0'
          : props.$rank === 3
            ? '#CD7F32'
            : 'transparent'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const RankBadge = styled.div<{ $rank: number }>`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(16px, 4.5vw, 22px);
  height: clamp(16px, 4.5vw, 22px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(10px, 3vw, 12px);
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: #000;
  z-index: 1;
  background-color: ${props =>
    props.$rank === 1
      ? '#FFD700'
      : props.$rank === 2
        ? '#C0C0C0'
        : props.$rank === 3
          ? '#CD7F32'
          : props.theme.colors.backgroundDark};
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: clamp(2px, 1vw, 6px);
`;

const EloText = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.textBlack};
`;

const SubText = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textLightGray};
`;

// 섹션 3: 리스트 스타일
const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ListTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
`;

const Pager = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const PagerButton = styled.button<{ disabled?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textBlack};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
`;

const PagerInfo = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
`;

const ListContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.borderLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

const ListRow = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 80px;
  align-items: center;
  padding: 10px 12px;
  border-top: 1px solid ${props => props.theme.colors.borderLight};
  background: ${props => props.theme.colors.background};
  cursor: pointer;

  &:first-child {
    border-top: none;
  }
`;

const RankCol = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const NameCol = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  min-width: 0;
`;

const NameText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NftBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  height: 18px;
  border-radius: 4px;
  background: linear-gradient(135deg, #fbe6c2, #ffd27f);
  color: #000;
  font-size: 10px;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const EloCol = styled.div`
  text-align: right;
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
`;

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

const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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

// 섹션 2: 내 정보 카드(요약)
const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};

  @media (max-width: 360px) {
    gap: ${props => props.theme.spacing.xs};
  }
`;

const InfoCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: ${props => props.theme.spacing.sm};
  min-height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoCardButton = styled(InfoCard)`
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  margin-bottom: 2px;
`;

const DotIcon = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.$color};
`;

const CardValue = styled.div`
  font-size: clamp(0.95rem, 3.5vw, 1.125rem);
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
`;

const CardLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textLightGray};
`;

// 검색 파라미터 초기화 전용 컴포넌트 (Suspense로 감쌈)
function InitFromSearch({
  sortedCategories,
  selectedId,
  onInit,
}: {
  sortedCategories: Array<{ value: number | string }>;
  selectedId: number | null;
  onInit: (id: number) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const last =
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const urlSport = searchParams?.get('sport');
    if (selectedId == null && sortedCategories.length > 0) {
      const initial = urlSport
        ? Number(urlSport)
        : last
          ? Number(last)
          : Number(sortedCategories[0].value);
      onInit(initial);
    }
    if (urlSport) localStorage.setItem(STORAGE_KEY, String(urlSport));
  }, [sortedCategories, selectedId, searchParams, onInit]);
  return null;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { sportOptions } = useCommunityStore();
  const sortedCategories = useMemo(() => {
    return [...sportOptions].sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
  }, [sportOptions]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // URL 쿼리 → 상태 초기화는 Suspense 경계 내 별도 컴포넌트에서 처리

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
    // URL 쿼리도 동기화
    const params = new URLSearchParams(window.location.search);
    params.set('sport', String(id));
    router.push(`/leaderboard?${params.toString()}`);
  };

  // 섹션 3: 목업 데이터와 페이지 상태
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const lastPage = 10; // 4~100 → 97명, 목업으로 10페이지 가정
  const startRank = 4 + (page - 1) * pageSize;
  const endRank = Math.min(100, startRank + pageSize - 1);

  const mockLeaders = useMemo(() => {
    // 높은 ELO가 상위가 되도록 4~100위 구간을 내림차순처럼 보이게 구성
    return Array.from({ length: 97 }).map((_, i) => ({
      id: i + 4,
      name: `유저${i + 4}`,
      // 4위가 가장 높고 아래로 갈수록 내려가도록 역산
      elo: 1200 - i,
      hasNft: (i + 4) % 3 === 0,
    }));
  }, []);
  const visibleLeaders = mockLeaders.slice(startRank - 4, endRank - 3);

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
        <Section>
          <TopRows>
            <Row>
              {[1, 2, 3].map(rank => (
                <AvatarCard key={rank} aria-label={`Top ${rank}`}>
                  <AvatarWrapper $size="lg">
                    <AvatarCircle
                      $size="lg"
                      $rank={rank}
                      $img={
                        rank === 1
                          ? BUSINESS_IMAGES.PEOPLE_01.src
                          : rank === 2
                            ? BUSINESS_IMAGES.PEOPLE_02.src
                            : BUSINESS_IMAGES.PEOPLE_03.src
                      }
                    />
                    <RankBadge $rank={rank}>{rank}</RankBadge>
                  </AvatarWrapper>
                  <Meta>
                    <Nickname>닉네임{rank}</Nickname>
                    <EloText>1.{rank}K</EloText>
                    <SubText>{10 * rank} 경기</SubText>
                  </Meta>
                </AvatarCard>
              ))}
            </Row>
            <Row>
              {[4, 5, 6, 7].map(rank => (
                <AvatarCard key={rank} aria-label={`Top ${rank}`}>
                  <AvatarWrapper $size="md">
                    <AvatarCircle
                      $size="md"
                      $rank={rank}
                      $img={
                        rank === 4
                          ? BUSINESS_IMAGES.PEOPLE_04.src
                          : rank === 5
                            ? BUSINESS_IMAGES.PEOPLE_05.src
                            : rank === 6
                              ? BUSINESS_IMAGES.PEOPLE_06.src
                              : BUSINESS_IMAGES.PEOPLE_07.src
                      }
                    />
                    <RankBadge $rank={rank}>{rank}</RankBadge>
                  </AvatarWrapper>
                  <Meta>
                    <Nickname>닉네임{rank}</Nickname>
                    <EloText>
                      {rank === 4
                        ? '970'
                        : rank === 5
                          ? '960'
                          : rank === 6
                            ? '950'
                            : '940'}
                    </EloText>
                    <SubText>{5 * rank} 경기</SubText>
                  </Meta>
                </AvatarCard>
              ))}
            </Row>
          </TopRows>
        </Section>
        <Section>
          <CardsRow>
            {/* 박스 1: ELO */}
            <InfoCard>
              <CardHeader>
                <DotIcon $color="#23424A" />
                <CardLabel>현재 ELO</CardLabel>
              </CardHeader>
              <CardValue>1,234</CardValue>
              <SubText>최근 +12 · 40경기</SubText>
            </InfoCard>

            {/* 박스 2: 내 순위 */}
            <InfoCard>
              <CardHeader>
                <DotIcon $color="#E8C87D" />
                <CardLabel>내 순위</CardLabel>
              </CardHeader>
              <CardValue>#123</CardValue>
              <SubText>상위 12%</SubText>
            </InfoCard>

            {/* 박스 3: 내 활동 진입 */}
            <InfoCardButton>
              <CardHeader>
                <DotIcon $color="#6c757d" />
                <CardLabel>내 활동</CardLabel>
              </CardHeader>
              <CardValue>전적/추이/NFT</CardValue>
              <SubText>탭하여 상세 보기</SubText>
            </InfoCardButton>
          </CardsRow>
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

        {/* 섹션 3: Top 4–100 리스트 (목업) */}
        <Section>
          <ListHeader>
            <ListTitle>Top 4–100</ListTitle>
            <Pager>
              <PagerButton
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                aria-label="이전"
              >
                ‹
              </PagerButton>
              <PagerInfo>
                {startRank}–{endRank}
              </PagerInfo>
              <PagerButton
                disabled={page === lastPage}
                onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                aria-label="다음"
              >
                ›
              </PagerButton>
            </Pager>
          </ListHeader>

          <ListContainer>
            {visibleLeaders.map((item, idx) => (
              <ListRow key={item.id} role="button">
                <RankCol>{startRank + idx}</RankCol>
                <NameCol>
                  <NameText>{item.name}</NameText>
                  {item.hasNft && <NftBadge>NFT</NftBadge>}
                </NameCol>
                <EloCol>{item.elo}</EloCol>
              </ListRow>
            ))}
          </ListContainer>
        </Section>
        {/* URL 쿼리 기반 초기화 (Suspense 필요 API 분리) */}
        <Suspense fallback={null}>
          <InitFromSearch
            sortedCategories={sortedCategories}
            selectedId={selectedId}
            onInit={setSelectedId}
          />
        </Suspense>
      </PageContent>
    </div>
  );
}
