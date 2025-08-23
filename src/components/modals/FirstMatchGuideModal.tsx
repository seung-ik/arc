'use client';

import styled from 'styled-components';
import { useState } from 'react';

interface FirstMatchGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.md};
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Description = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.textGray};
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const TokenInfo = styled.div`
  background: ${props => props.theme.colors.backgroundGray};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const TokenText = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeights.medium};

  strong {
    font-weight: ${props => props.theme.typography.fontWeights.bold};
    color: ${props => props.theme.colors.primary};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${props => props.theme.colors.primary};
`;

const CheckboxLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  cursor: pointer;
`;

const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;

export default function FirstMatchGuideModal({
  isOpen,
  onClose,
}: FirstMatchGuideModalProps) {
  const [dontShowToday, setDontShowToday] = useState(false);

  const handleConfirm = () => {
    if (dontShowToday) {
      // 오늘 하루 동안 보지 않기 설정
      const today = new Date().toDateString();
      localStorage.setItem('firstMatchGuideHidden', today);
    }
    onClose();
  };

  return (
    <Overlay isOpen={isOpen}>
      <ModalContent>
        <Title>🎯 첫 매치 결과를 등록해보세요!</Title>
        <Description>매치 결과를 등록하면 토큰을 받을 수 있어요.</Description>

        <TokenInfo>
          <TokenText>
            💰 첫 등록 시 <strong>5토큰</strong> 보상 지급
          </TokenText>
        </TokenInfo>

        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="dontShowToday"
            checked={dontShowToday}
            onChange={e => setDontShowToday(e.target.checked)}
          />
          <CheckboxLabel htmlFor="dontShowToday">
            오늘 하루 동안 보지 않기
          </CheckboxLabel>
        </CheckboxContainer>

        <Button onClick={handleConfirm}>확인</Button>
      </ModalContent>
    </Overlay>
  );
}
