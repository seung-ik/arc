'use client';

import styled from 'styled-components';
import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  profileImage?: string;
  isMyProfile?: boolean;
  onNicknameChange?: () => void;
}

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.theme.colors.background};
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  /* 더 진한 파스텔 블루 계열 그라데이션 */
  background: linear-gradient(135deg, #b2ccff, #84acff, #4a90ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: ${props => props.theme.colors.textWhite};
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const ProfileName = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin: 0;
  text-align: center;
  line-height: 1;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  justify-content: center;
  margin-bottom: 8px;
`;

const ProfileLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  text-align: center;
`;

const NicknameChangeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};

  &:hover {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }
`;

export default function ProfileHeader({
  name,
  profileImage,
  isMyProfile = false,
  onNicknameChange,
}: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <HeaderContainer>
      <ProfileImage>
        {profileImage ? (
          <Image
            src={profileImage}
            alt={name}
            width={80}
            height={80}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          getInitials(name)
        )}
      </ProfileImage>
      <NameContainer>
        <ProfileName>{name}</ProfileName>
        {isMyProfile && onNicknameChange && (
          <NicknameChangeButton onClick={onNicknameChange}>
            ↻
          </NicknameChangeButton>
        )}
      </NameContainer>
      <ProfileLabel>{isMyProfile ? '내 프로필' : '사용자 프로필'}</ProfileLabel>
    </HeaderContainer>
  );
}
