'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { ModalOverlay, ModalContent, ModalButton } from './style';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  rewardText: string;
  rewardAmount: string;
  localStorageKey: string;
}

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

const RewardInfo = styled.div`
  background: ${props => props.theme.colors.backgroundGray};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const RewardText = styled.p`
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

export default function GuideModal({
  isOpen,
  onClose,
  title,
  description,
  rewardText,
  rewardAmount,
  localStorageKey,
}: GuideModalProps) {
  const [dontShowToday, setDontShowToday] = useState(false);

  const handleConfirm = () => {
    if (dontShowToday) {
      // 오늘 하루 동안 보지 않기 설정
      const today = new Date().toDateString();
      localStorage.setItem(localStorageKey, today);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>{title}</Title>
        <Description>{description}</Description>

        <RewardInfo>
          <RewardText>
            💰 {rewardText} <strong>{rewardAmount}</strong> 보상 지급
          </RewardText>
        </RewardInfo>

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

        <div style={{ display: 'flex' }}>
          <ModalButton variant="primary" onClick={handleConfirm}>
            확인
          </ModalButton>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}
