'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { ICONS } from '@/assets';
import { useModal } from '@/hooks/useModal';
import BasicModal from '@/components/modals/BasicModal';

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

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  transition: all 0.2s;

  &:hover {
    background-color: #e9ecef;
    transform: translateY(-1px);
  }
`;

const ActionButtonText = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
`;

export default function ProfileHeader({
  name,
  profileImage,
  isMyProfile = false,
  onNicknameChange,
}: ProfileHeaderProps) {
  const veryChatModal = useModal();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleVeryChatConnect = () => {
    alert('준비중인 기능입니다.');
  };

  const handleVeryChatLearnMore = () =>
    window.open('https://www.verychat.io/', '_blank');

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
      <ProfileLabel>
        {isMyProfile ? (
          <ActionButton onClick={veryChatModal.openModal}>
            <ActionButtonText>Connect</ActionButtonText>
            <Image src={ICONS.VERYCHAT} alt="verychat" width={24} height={24} />
          </ActionButton>
        ) : (
          <ActionButton onClick={() => alert('준비중인 기능입니다.')}>
            <ActionButtonText>친구추가</ActionButtonText>
            <Image src={ICONS.VERYCHAT} alt="verychat" width={24} height={24} />
          </ActionButton>
        )}

        {/* VeryChat 연결 모달 */}
        <BasicModal
          isOpen={veryChatModal.isOpen}
          onClose={veryChatModal.closeModal}
          title="VeryChat 연동"
          content={`연결 시 매치글 작성과 같은 서비스 이용시\n채팅 기능을 사용할 수 있습니다.`}
          leftButtonText="VeryChat 알아보기"
          rightButtonText="Connect"
          onLeftButtonClick={handleVeryChatLearnMore}
          onRightButtonClick={handleVeryChatConnect}
          leftButtonVariant="secondary"
          rightButtonVariant="primary"
        />
      </ProfileLabel>
    </HeaderContainer>
  );
}
