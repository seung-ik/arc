'use client';

import styled from 'styled-components';
import Modal from './Modal';
import { ModalButton } from './style';

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
`;

interface TwoButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function TwoButtonModal({
  isOpen,
  onClose,
  title,
  content,
  cancelText = '취소',
  confirmText = '확인',
  onSubmit,
  isLoading = false,
}: TwoButtonModalProps) {
  const handleConfirm = () => {
    onSubmit();
  };

  const footer = (
    <ButtonGroup>
      <ModalButton variant="secondary" onClick={onClose} disabled={isLoading}>
        {cancelText}
      </ModalButton>
      <ModalButton
        variant="primary"
        onClick={handleConfirm}
        disabled={isLoading}
      >
        {isLoading ? '처리중...' : confirmText}
      </ModalButton>
    </ButtonGroup>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      {content}
    </Modal>
  );
}
