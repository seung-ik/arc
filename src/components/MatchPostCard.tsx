'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

interface MatchPost {
  id: number;
  title: string;
  authorId: string;
  authorName: string;
  date: string;
  category: string;
  postType: string;
  matchLocation?: string;
  myElo?: string;
  preferredElo?: string;
  validityPeriod?: string;
  viewCount?: number;
  commentCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface MatchPostCardProps {
  post: MatchPost;
  onClick?: (postId: number) => void;
}

const MatchCard = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
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
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const MatchTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: 0;
  flex: 1;
  line-height: 1.4;
`;

const MatchBadge = styled.span`
  background-color: ${(props) => props.theme.colors.postType.match.background};
  color: ${(props) => props.theme.colors.postType.match.text};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  margin-left: ${(props) => props.theme.spacing.sm};
  flex-shrink: 0;
`;

const MatchInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const EloBadge = styled.span`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const LocationBadge = styled.span`
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const ValidityPeriod = styled.span`
  color: ${(props) => props.theme.colors.textLightGray};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  margin-left: auto;
`;

// 유효기간 계산 함수
const calculateValidityPeriod = (createdDate: string, validityPeriod: string): string => {
  const created = new Date(createdDate);
  const now = new Date();

  const validityDays = parseInt(validityPeriod);
  const endDate = new Date(created.getTime() + validityDays * 24 * 60 * 60 * 1000);

  const timeDiff = endDate.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return '만료됨';
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

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
      // 기본적으로 상세 페이지로 이동
      router.push(`${ROUTES.community.post(post.id.toString())}`);
    }
  };

  const validityText = post.validityPeriod
    ? calculateValidityPeriod(post.date, post.validityPeriod)
    : post.date;

  return (
    <MatchCard onClick={handleClick}>
      <MatchHeader>
        <MatchTitle>{post.title}</MatchTitle>
        <MatchBadge>매치</MatchBadge>
      </MatchHeader>

      <MatchInfo>
        {post.myElo && <EloBadge>ELO {post.myElo}</EloBadge>}
        {post.matchLocation && <LocationBadge>{post.matchLocation}</LocationBadge>}
        <ValidityPeriod>{validityText}</ValidityPeriod>
      </MatchInfo>
    </MatchCard>
  );
}
