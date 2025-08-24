'use client';

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAuthStore } from '@/stores/authStore';
import { useWepin } from '@/contexts/WepinContext';
import { useLogoutAll } from '@/hooks';

const ChipContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: 0.15rem;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  cursor: default;
  transition: all 0.2s ease;
  background: rgb(47, 90, 100);

  &:hover {
    background: white;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: white;
  }
`;

const Avatar = styled.div<{ $url?: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  /* 강한 대비의 딥 톤 그라데이션 (프로필 이미지 대체용) */
  background: linear-gradient(
    135deg,
    rgb(20, 30, 53),
    rgb(47, 90, 100),
    #0ea5a0
  );
  ${props => (props.$url ? `background-image: url(${props.$url});` : '')}
  background-size: cover;
  background-position: center;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  padding: 8px 0;
  min-width: 90px;
  z-index: 1000;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: none;
  text-align: left;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textBlack};
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.colors.backgroundGray};
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export default function ProfileChip() {
  const { userProfile } = useAuthStore();
  const { handleLogout } = useLogoutAll();
  const { isInitialized, wepinSDK, isLoggedIn, loginByWepin } = useWepin();
  const displayName = userProfile?.nickname || '프로필';
  const imageUrl = userProfile?.profileImageUrl || undefined;
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => setOpen(v => !v);
  const handleOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest('[data-chip-wrapper]'))
      setOpen(false);
  };

  const openWallet = async () => {
    if (!isInitialized || !wepinSDK) {
      alert('Wepin SDK가 초기화되지 않았습니다.');
      return;
    }
    try {
      if (!isLoggedIn) {
        await loginByWepin();
      }
      await wepinSDK.openWidget();
    } catch (e) {
      console.error(e);
      alert('지갑 열기에 실패했습니다.');
    }
    setOpen(false);
  };

  const doLogout = async () => {
    setOpen(false);
    await handleLogout();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <Wrapper data-chip-wrapper>
      <ChipContainer onClick={handleToggle}>
        <Avatar $url={imageUrl}>{displayName.charAt(0)}</Avatar>
        {/* <NicknameText>{displayName}</NicknameText> */}
      </ChipContainer>
      {open && (
        <Dropdown>
          <DropdownItem onClick={openWallet}>지갑 열기</DropdownItem>
          <DropdownItem onClick={doLogout}>로그아웃</DropdownItem>
        </Dropdown>
      )}
    </Wrapper>
  );
}
