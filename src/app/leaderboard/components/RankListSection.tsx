'use client';

import styled from 'styled-components';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ICONS } from '@/assets';

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing['xl']};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ListTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
`;

const Pager = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const PagerButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
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
  min-width: 58px;
  text-align: center;
`;

const ListContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

const ListRow = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 80px;
  align-items: center;
  padding: 10px 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
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

export default function RankListSection() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const lastPage = 10; // 4~100 → 97명, 목업으로 10페이지 가정
  const startRank = 4 + (page - 1) * pageSize;
  const endRank = Math.min(100, startRank + pageSize - 1);

  const mockLeaders = useMemo(() => {
    return Array.from({ length: 97 }).map((_, i) => ({
      id: i + 4,
      name: `유저${i + 4}`,
      elo: 1200 - i,
      hasNft: (i + 4) % 3 === 0,
    }));
  }, []);
  const visibleLeaders = mockLeaders.slice(startRank - 4, endRank - 3);

  return (
    <>
      <ListHeader>
        <ListTitle>Top 4 – 100</ListTitle>
        <Pager>
          <PagerButton
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            aria-label="이전"
          >
            <Image
              src={ICONS.ARROW_LEFT}
              alt="arrow-left"
              width={16}
              height={16}
            />
          </PagerButton>
          <PagerInfo>
            {startRank} – {endRank}
          </PagerInfo>
          <PagerButton
            disabled={page === lastPage}
            onClick={() => setPage(p => Math.min(lastPage, p + 1))}
            aria-label="다음"
          >
            <Image
              src={ICONS.ARROW_LEFT}
              alt="arrow-left"
              width={16}
              height={16}
              style={{ transform: 'rotate(180deg)' }}
            />
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
    </>
  );
}
