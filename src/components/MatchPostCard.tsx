'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { MatchPost } from '@/types/post';

interface MatchPostCardProps {
  post: MatchPost;
  onClick?: (postId: number) => void;
  isCard?: boolean;
}

// 기존 커뮤니티 페이지용 세로형 레이아웃
const MatchContainer = styled.div`
  padding: ${props => props.theme.spacing.md} 0;
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGray};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CardContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  flex: 1;
`;

const MatchTag = styled.span`
  background-color: ${props => props.theme.colors.postType.match.background};
  color: ${props => props.theme.colors.postType.match.text};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  flex-shrink: 0;
`;

const MatchTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin: 0;
  line-height: 1.4;
`;

const LocationText = styled.span`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  flex-shrink: 0;
`;

const MatchInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const EloBadge = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const StatusText = styled.span`
  background-color: ${props => props.theme.colors.success};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-left: auto;
`;

// 새로운 가로형 카드 레이아웃
const MatchCardContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: ${props => props.theme.spacing.md};

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

const ImageSection = styled.div`
  flex: 0 0 40%;
  position: relative;
  min-height: 120px;
  background-color: ${props => props.theme.colors.backgroundGray};
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const ContentSection = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

const LocationIcon = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.textGray};
  display: inline-block;
`;

const ParticipantBadge = styled.span`
  background-color: ${props => props.theme.colors.backgroundGray};
  color: ${props => props.theme.colors.textBlack};
  padding: 2px 6px;
  border-radius: 8px;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const VenueName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  line-height: 1.3;
`;

const DateTimeInfo = styled.div`
  color: ${props => props.theme.colors.textBlack};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

const GameIcon = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.textGray};
  display: inline-block;
`;

const Separator = styled.span`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.textGray};
  display: inline-block;
`;

// 유효기간 계산 함수
const calculateValidityPeriod = (
  createdDate: string,
  validityPeriod: string
): string => {
  const created = new Date(createdDate);
  const now = new Date();

  const validityDays = parseInt(validityPeriod);
  const endDate = new Date(
    created.getTime() + validityDays * 24 * 60 * 60 * 1000
  );

  const timeDiff = endDate.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return '만료됨';
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (days > 0) {
    return `유효기간: ${days}일 남음`;
  } else if (hours > 0) {
    return `유효기간: ${hours}시간 남음`;
  } else {
    return '유효기간: 1시간 미만';
  }
};

export default function MatchPostCard({
  post,
  onClick,
  isCard,
}: MatchPostCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(post.id);
    } else {
      router.push(`${ROUTES.community.post(post.id.toString())}?type=match`);
    }
  };

  // 상태 결정 (유효기간 기반)
  const getStatus = () => {
    if (!post.validityPeriod) return '진행중';

    const validityText = calculateValidityPeriod(
      post.date,
      post.validityPeriod
    );
    if (validityText === '만료됨') {
      return '만료됨';
    } else {
      return '진행중';
    }
  };

  const status = getStatus();

  // isCard가 true일 때만 새로운 가로형 카드 레이아웃 사용
  if (isCard) {
    // 참가자 수 계산 (임시 데이터)
    const currentParticipants = 1;
    const maxParticipants = 2;
    const gameType = post.title.includes('단식') ? '단식' : '복식';

    // myElo가 숫자인지 확인하고 안전하게 처리
    const myEloNumber = typeof post.myElo === 'number' ? post.myElo : 2;
    const tierRange = `아마추어 ${Math.max(1, myEloNumber - 1)}~아마추어 ${Math.min(3, myEloNumber + 1)}`;

    return (
      <MatchCardContainer onClick={handleClick}>
        <ImageSection>
          <ImagePlaceholder>테니스장</ImagePlaceholder>
        </ImageSection>

        <ContentSection>
          <TopRow>
            <LocationInfo>
              <LocationIcon />
              {post.matchLocation || '서울 도봉구'}
            </LocationInfo>
            <ParticipantBadge>
              {currentParticipants}/{maxParticipants}명
            </ParticipantBadge>
          </TopRow>

          <VenueName>{post.title || '다락원 체육공원 테니스장'}</VenueName>

          <DateTimeInfo>
            {post.date
              ? new Date(post.date).toLocaleDateString('ko-KR', {
                  month: 'numeric',
                  day: 'numeric',
                  weekday: 'short',
                })
              : '7. 30.(수)'}{' '}
            08:00~10:00
          </DateTimeInfo>

          <GameInfo>
            <GameIcon />
            {gameType}
            <Separator />
            {tierRange}
          </GameInfo>
        </ContentSection>
      </MatchCardContainer>
    );
  }

  // isCard가 false일 때는 기존 커뮤니티 페이지용 레이아웃 사용
  const Container = isCard ? CardContainer : MatchContainer;

  return (
    <Container onClick={handleClick}>
      <MatchHeader>
        <TitleSection>
          <MatchTag>매치</MatchTag>
          <MatchTitle>{post.title}</MatchTitle>
        </TitleSection>
        {post.matchLocation && (
          <LocationText>{post.matchLocation}</LocationText>
        )}
      </MatchHeader>

      <MatchInfo>
        {post.myElo && <EloBadge>ELO {post.myElo}</EloBadge>}
        <StatusText>{status}</StatusText>
      </MatchInfo>
    </Container>
  );
}
