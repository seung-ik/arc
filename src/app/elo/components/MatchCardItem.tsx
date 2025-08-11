'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import Image from 'next/image';
import { ICONS } from '@/assets';

import type { MatchHistoryResult } from '@/api/useMatch';

interface MatchCardItemProps {
  match: MatchHistoryResult;
}

interface PlayerProfileProps {
  avatar: string;
  nickname: string;
  beforeElo: number;
  afterElo: number;
  eloChange: string;
  isWin: boolean;
  isOpponent?: boolean;
  profileImage?: string;
  onNicknameClick?: () => void;
}

const PlayerProfile = ({
  avatar,
  nickname,
  beforeElo,
  afterElo,
  eloChange,
  isWin,
  isOpponent = false,
  profileImage,
  onNicknameClick,
}: PlayerProfileProps) => {
  return (
    <ProfileSection>
      {profileImage ? (
        <ProfileImage
          src={profileImage}
          alt="profile"
          width={32}
          height={32}
          style={{ borderRadius: '50%' }}
        />
      ) : (
        <ProfileAvatar>{avatar}</ProfileAvatar>
      )}
      <ProfileInfo>
        {isOpponent ? (
          <OpponentId onClick={onNicknameClick}>{nickname}</OpponentId>
        ) : (
          <ProfileName>{nickname}</ProfileName>
        )}
        <EloInfo>
          {beforeElo} → {afterElo}{' '}
          <span
            style={{
              color: isWin ? '#6CBF84' : '#D9675F',
              fontWeight: '600',
            }}
          >
            ({eloChange})
          </span>
        </EloInfo>
      </ProfileInfo>
    </ProfileSection>
  );
};

const MatchCard = styled.div<{ $isWin: boolean }>`
  border-left: 8px solid
    ${props =>
      props.$isWin ? props.theme.colors.primary : props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.sm};
  box-shadow: 0 1px 3px
    ${props =>
      props.$isWin ? props.theme.colors.primary : props.theme.colors.secondary};
  display: flex;
  align-items: stretch;
  position: relative;
`;

const MainContent = styled.div<{ $isWin: boolean }>`
  display: flex;
  flex: 1;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: white;
  gap: ${props => props.theme.spacing.md};
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
`;

const ExpandSection = styled.div<{ $isWin: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 12px 4px;
`;

const ResultText = styled.span<{ $isWin: boolean }>`
  color: ${props =>
    props.$isWin ? props.theme.colors.primary : props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: 700;
`;

const EloInfo = styled.div`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const DateText = styled.span`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes['xs']};
  position: absolute;
  top: 4px;
  right: 12px;
  white-space: nowrap;
`;

const SportText = styled.span`
  color: ${props => props.theme.colors.textBlack};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: 700;
`;

const OpponentId = styled.button`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  text-decoration: underline;
  transition: color 0.2s;
  text-align: left;

  &:hover {
    color: ${props => props.theme.colors.primaryHover};
  }
`;

const ProfileAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  font-weight: bold;

  @media (max-width: 560px) {
    display: none;
  }
`;

const ProfileImage = styled(Image)`
  @media (max-width: 560px) {
    display: none;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 45%;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProfileName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #333;
`;

const DividerContainer = styled.div`
  width: 12px;
  display: flex;
  justify-content: center;
`;

const Divider = styled.div`
  width: 1px;
  height: 60px;
  background-color: #e1e1e1;
`;

const MatchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  flex: 1;
  position: relative;
  position: relative;
  top: -10px;
`;

export default function MatchCardItem({ match }: MatchCardItemProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpponentClick = (opponentId: string) => {
    router.push(ROUTES.profile.user(opponentId));
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const isWin = match.result === 'win';

  const headToHeadWins = match.my_wins;
  const headToHeadLosses = match.my_losses;
  console.log(match);

  return (
    <MatchCard $isWin={isWin}>
      <MainContent $isWin={isWin}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <SportText>{match.sportCategory}</SportText>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ResultText $isWin={isWin}>
              {match.result === 'win'
                ? '승'
                : match.result === 'lose'
                  ? '패'
                  : '무'}
            </ResultText>
            <span style={{ fontSize: '12px', color: '#666' }}>
              ({headToHeadWins}승 {headToHeadLosses}패)
            </span>
          </div>
        </div>

        <MatchContainer>
          {/* 내 정보 */}
          <PlayerProfile
            avatar="M"
            nickname="나"
            beforeElo={match.elo_before}
            afterElo={match.elo_after}
            eloChange={
              match.elo_delta > 0 ? `+${match.elo_delta}` : `${match.elo_delta}`
            }
            isWin={isWin}
          />

          {/* 구분선 */}
          <DividerContainer>
            <Divider />
          </DividerContainer>

          {/* 상대 정보 */}
          <PlayerProfile
            avatar={match.partner_nickname.charAt(0).toUpperCase()}
            nickname={match.partner_nickname}
            beforeElo={match.partner_elo_before}
            afterElo={match.partner_elo_after}
            eloChange={
              match.partner_elo_delta > 0
                ? `+${match.partner_elo_delta}`
                : `${match.partner_elo_delta}`
            }
            isWin={!isWin}
            isOpponent={true}
            profileImage={undefined}
            onNicknameClick={() => handleOpponentClick(match.partner_nickname)}
          />
        </MatchContainer>
      </MainContent>

      <ExpandSection $isWin={isWin}>
        <DateText>
          {new Date(match.created_at).toLocaleDateString('ko-KR')}
        </DateText>

        <ExpandButton onClick={handleExpandClick}>
          <Image src={ICONS.ARROW_DOWN} alt="expand" width={20} height={20} />
        </ExpandButton>
      </ExpandSection>
    </MatchCard>
  );
}
