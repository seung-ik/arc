'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { MatchPost } from '@/types/post';

interface MatchPostCardProps {
  post: MatchPost;
  onClick?: (postId: number) => void;
}

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

export default function MatchPostCard({ post, onClick }: MatchPostCardProps) {
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

  return (
    <MatchContainer onClick={handleClick}>
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
    </MatchContainer>
  );
}
