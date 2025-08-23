'use client';

import { BANNERS } from '@/assets';
import Image from 'next/image';
import styled from 'styled-components';

const BannerContainer = styled.div`
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: ${props => props.theme.spacing.sm} 0;
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
  width: 100%;
  overflow: hidden;
  min-height: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const BannerTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const BannerDescription = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  opacity: 0.9;
  white-space: pre-line;
  text-align: left;
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
  onClick,
}: AdBannerProps) {
  return (
    <BannerContainer onClick={onClick}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <div>
          <BannerTitle>{title}</BannerTitle>
          <BannerDescription>{description}</BannerDescription>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}
        >
          <button
            style={{
              padding: '4px 16px',
              background: '#fff',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              bottom: '12px',
            }}
          >
            자세히 보기
          </button>
        </div>
      </div>
      <Image
        src={BANNERS.EX01}
        alt="ad"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '140px',
          objectFit: 'cover',
          opacity: 0.7,
        }}
      />
    </BannerContainer>
  );
}
