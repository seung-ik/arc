'use client';

import styled from 'styled-components';

const BannerContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  color: white;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const BannerTitle = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing.sm} 0;
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
`;

const BannerDescription = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  opacity: 0.9;
`;

const BannerBadge = styled.span`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  margin-left: ${(props) => props.theme.spacing.sm};
`;

interface AdBannerProps {
  title?: string;
  description?: string;
  badge?: string;
  onClick?: () => void;
}

export default function AdBanner({
  title = '🏆 첫 번째 대회 참가 신청',
  description = '후원받은 토큰으로 운영되는 종목별 대회에 참가해보세요!',
  badge = '광고',
  onClick,
}: AdBannerProps) {
  return (
    <BannerContainer onClick={onClick}>
      <BannerTitle>
        {title}
        <BannerBadge>{badge}</BannerBadge>
      </BannerTitle>
      <BannerDescription>{description}</BannerDescription>
    </BannerContainer>
  );
}
