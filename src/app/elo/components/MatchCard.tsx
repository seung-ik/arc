'use client';

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { MatchPostItem } from '@/types/match';
import Image from 'next/image';
import { getCategoryImg } from '@/utils';

interface MatchCardProps {
  post: MatchPostItem;
  onClick?: (postId: number) => void;
}

// 가로형 카드 레이아웃
const MatchCardContainer = styled.div`
  box-sizing: border-box;
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
  width: 100px;
  height: 100px;
  position: relative;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 8px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.xs};
`;

const EloBadge = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 3px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const ParticipantBadge = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 3px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const VenueName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  line-height: 1.3;
`;

const DateTimeInfo = styled.div`
  color: ${props => props.theme.colors.textBlack};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

export default function MatchCard({ post, onClick }: MatchCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(post.id);
    } else {
      router.push(`${ROUTES.community.post(post.id.toString())}?type=match`);
    }
  };

  console.log(post);

  // 참가자 수 계산
  const currentParticipants = 1; // API에서 제공되지 않는 필드
  const maxParticipants = post.participantCount || 2;

  return (
    <MatchCardContainer onClick={handleClick}>
      <ImageSection>
        <Image
          src={getCategoryImg(post.sportCategory.name)}
          alt="ad"
          width={100}
        />
        <ImagePlaceholder>테니스장</ImagePlaceholder>
      </ImageSection>

      <ContentSection>
        <TopRow>
          <LocationInfo>{post.matchLocation}</LocationInfo>
          <div style={{ display: 'flex', gap: '6px' }}>
            <EloBadge>ELO {post.myElo || 'N/A'}</EloBadge>
            <ParticipantBadge>
              {currentParticipants}/{maxParticipants}명
            </ParticipantBadge>
          </div>
        </TopRow>

        <VenueName style={{ marginTop: '-12px' }}>{post.title}</VenueName>

        <DateTimeInfo>
          {post.createdAt
            ? new Date(post.matchDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                weekday: 'short',
              })
            : '날짜 협의'}{' '}
        </DateTimeInfo>
      </ContentSection>
    </MatchCardContainer>
  );
}
