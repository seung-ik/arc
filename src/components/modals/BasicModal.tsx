import React from 'react';
import styled from 'styled-components';

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
            {leftButtonText}
          </ModalButton>
          <ModalButton variant={rightButtonVariant} onClick={handleRightClick}>
            {rightButtonText}
          </ModalButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

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
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

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

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #666;
  }
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

const ModalButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) =>
    variant === 'primary'
      ? `
        background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
        color: white;

        &:hover {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          transform: translateY(-1px);
        }
      `
      : `
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;

        &:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
        }
      `}

  &:active {
    transform: translateY(0);
  }
`;

export default BasicModal;
