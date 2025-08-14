'use client';

import styled from 'styled-components';

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
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12),
      0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  border-radius: 50%;
`;
const AvatarCircle = styled.div<{ $img?: string; $rank: number }>`
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
const GameCount = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
  margin-left: 4px;
`;

export interface HighRankerItem {
  id: number;
  rank: number;
  name: string;
  elo: string;
  games: number;
  avatarUrl?: string;
}

export default function HighRankerSection({
  rankers,
}: {
  rankers: HighRankerItem[];
}) {
  const top3 = rankers.filter(r => r.rank <= 3).sort((a, b) => a.rank - b.rank);
  const next4 = rankers
    .filter(r => r.rank >= 4 && r.rank <= 7)
    .sort((a, b) => a.rank - b.rank);
  return (
    <TopRows>
      <Row>
        {top3.map(r => (
          <AvatarCard key={r.id} aria-label={`Top ${r.rank}`}>
            <AvatarWrapper $size="lg">
              <AvatarCircle $img={r.avatarUrl} $rank={r.rank} />
              <RankBadge $rank={r.rank}>{r.rank}</RankBadge>
            </AvatarWrapper>
            <Meta>
              <span>{r.name}</span>
              <EloText>
                {r.elo} <GameCount>({r.games}경기)</GameCount>
              </EloText>
            </Meta>
          </AvatarCard>
        ))}
      </Row>
      <Row style={{ marginTop: '20px' }}>
        {next4.map(r => (
          <AvatarCard key={r.id} aria-label={`Top ${r.rank}`}>
            <AvatarWrapper $size="md">
              <AvatarCircle $img={r.avatarUrl} $rank={r.rank} />
              <RankBadge $rank={r.rank}>{r.rank}</RankBadge>
            </AvatarWrapper>
            <Meta>
              <span>{r.name}</span>
              <EloText>
                {r.elo} <GameCount>({r.games}경기)</GameCount>
              </EloText>
            </Meta>
          </AvatarCard>
        ))}
      </Row>
    </TopRows>
  );
}
