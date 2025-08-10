import React from 'react';
import styled from 'styled-components';

interface CancelConfirmModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onCancel: () => void;
}

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const ModalMessage = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant }) =>
    $variant === 'primary'
      ? `
        background-color: #ff4757;
        color: white;
        &:hover {
          background-color: #ff3742;
        }
      `
      : `
        background-color: #f1f2f6;
        color: #333;
        &:hover {
          background-color: #e9ecef;
        }
      `}
`;

export default function CancelConfirmModal({
  isOpen,
  onContinue,
  onCancel,
}: CancelConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <Modal>
      <ModalContent>
        <ModalTitle>작성을 취소하시겠습니까?</ModalTitle>
        <ModalMessage>
          작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?
        </ModalMessage>
        <ModalButtonGroup>
          <ModalButton onClick={onContinue}>계속 작성</ModalButton>
          <ModalButton $variant="primary" onClick={onCancel}>
            취소하기
          </ModalButton>
        </ModalButtonGroup>
      </ModalContent>
    </Modal>
  );
}
