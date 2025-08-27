import React from 'react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, CloseButton, ModalButton } from './style';

interface TwoButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content?: string;
  leftButtonText: string;
  rightButtonText: string;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
  leftButtonVariant?: 'primary' | 'secondary';
  rightButtonVariant?: 'primary' | 'secondary';
}

const BasicModal: React.FC<TwoButtonModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  leftButtonText,
  rightButtonText,
  onLeftButtonClick,
  onRightButtonClick,
  leftButtonVariant = 'secondary',
  rightButtonVariant = 'primary',
}) => {
  if (!isOpen) return null;

  const handleLeftClick = () => {
    onLeftButtonClick();
    onClose();
  };

  const handleRightClick = () => {
    onRightButtonClick();
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        {content && (
          <ModalBody>
            <ModalText>{content}</ModalText>
          </ModalBody>
        )}

        <ButtonGroup>
          <ModalButton variant={leftButtonVariant} onClick={handleLeftClick}>
            {leftButtonText}ㅁㅁ
          </ModalButton>
          <ModalButton variant={rightButtonVariant} onClick={handleRightClick}>
            {rightButtonText}
          </ModalButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const ModalBody = styled.div`
  margin-bottom: 24px;
`;

const ModalText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  white-space: pre-line;
  text-align: left;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export default BasicModal;
