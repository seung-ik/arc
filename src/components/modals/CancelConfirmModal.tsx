import React from 'react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, ModalButton } from './style';

interface CancelConfirmModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onCancel: () => void;
}

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

export default function CancelConfirmModal({
  isOpen,
  onContinue,
  onCancel,
}: CancelConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>작성을 취소하시겠습니까?</ModalTitle>
        <ModalMessage>
          작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?
        </ModalMessage>
        <ModalButtonGroup>
          <ModalButton variant="secondary" onClick={onContinue}>
            계속 작성
          </ModalButton>
          <ModalButton variant="primary" onClick={onCancel}>
            취소하기
          </ModalButton>
        </ModalButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}
