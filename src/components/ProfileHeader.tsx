'use client';

import styled from 'styled-components';

interface ProfileHeaderProps {
  name: string;
  profileImage?: string;
  isMyProfile?: boolean;
}

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) => props.theme.colors.background};
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: ${(props) => props.theme.colors.textWhite};
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const ProfileName = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: 0 0 8px 0;
  text-align: center;
`;

const ProfileLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textGray};
  text-align: center;
`;

export default function ProfileHeader({
  name,
  profileImage,
  isMyProfile = false,
}: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <HeaderContainer>
      <ProfileImage>
        {profileImage ? (
          <img
            src={profileImage}
            alt={name}
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          getInitials(name)
        )}
      </ProfileImage>
      <ProfileName>{name}</ProfileName>
      <ProfileLabel>{isMyProfile ? '내 프로필' : '사용자 프로필'}</ProfileLabel>
    </HeaderContainer>
  );
}
