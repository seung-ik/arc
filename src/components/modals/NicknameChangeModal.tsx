'use client';

import styled from 'styled-components';
import { useState } from 'react';

interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newNickname: string) => void;
  currentNickname: string;
  userTokens: number;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.md};
  text-align: center;
`;

const TokenInfo = styled.div`
  background-color: ${props => props.theme.colors.primaryLight};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const TokenIcon = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  margin-right: ${props => props.theme.spacing.xs};
`;

const TokenText = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const TokenWarning = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
  margin-top: ${props => props.theme.spacing.xs};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textBlack};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textGray};
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  margin-top: ${props => props.theme.spacing.xs};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s;

  ${props =>
    props.$variant === 'primary'
      ? `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.textWhite};
    &:hover {
      background-color: ${props.theme.colors.primaryHover};
    }
    &:disabled {
      background-color: ${props.theme.colors.textGray};
      cursor: not-allowed;
    }
  `
      : `
    background-color: transparent;
    color: ${props.theme.colors.textBlack};
    &:hover {
      background-color: ${props.theme.colors.background};
    }
  `}
`;

export default function NicknameChangeModal({
  isOpen,
  onClose,
  onSubmit,
  currentNickname,
  userTokens,
}: NicknameChangeModalProps) {
  const [newNickname, setNewNickname] = useState(currentNickname);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // 유효성 검사
    if (!newNickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (newNickname.trim().length < 2) {
      setError('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    if (newNickname.trim().length > 10) {
      setError('닉네임은 10자 이하여야 합니다.');
      return;
    }

    if (newNickname.trim() === currentNickname) {
      setError('현재 닉네임과 동일합니다.');
      return;
    }

    if (userTokens < 1) {
      setError('토큰이 부족합니다.');
      return;
    }

    setError('');
    onSubmit(newNickname.trim());
    onClose();
  };

  const handleClose = () => {
    setNewNickname(currentNickname);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>닉네임 변경</ModalTitle>

        <TokenInfo>
          <TokenIcon>🪙</TokenIcon>
          <TokenText>닉네임 변경에 1토큰이 필요합니다</TokenText>
          <TokenWarning>현재 보유 토큰: {userTokens}개</TokenWarning>
        </TokenInfo>

        <FormGroup>
          <Label>새 닉네임</Label>
          <Input
            type="text"
            value={newNickname}
            onChange={e => setNewNickname(e.target.value)}
            placeholder="새 닉네임을 입력하세요"
            maxLength={10}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>

        <ButtonGroup>
          <Button onClick={handleClose}>취소</Button>
          <Button
            $variant="primary"
            onClick={handleSubmit}
            disabled={userTokens < 1}
          >
            변경하기
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}
