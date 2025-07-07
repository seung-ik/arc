'use client';

import styled from 'styled-components';
import Modal from './Modal';

const ButtonGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
`;

const CancelButton = styled.button`
  background-color: ${(props) => props.theme.colors.secondaryLight};
  color: ${(props) => props.theme.colors.textGray};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.lg};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.border};
    color: ${(props) => props.theme.colors.textBlack};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ConfirmButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.textWhite};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.lg};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.textLightGray};
    cursor: not-allowed;
    transform: none;
  }
`;

interface TwoButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
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
      <CancelButton onClick={onClose} disabled={isLoading}>
        {cancelText}
      </CancelButton>
      <ConfirmButton onClick={handleConfirm} disabled={isLoading}>
        {isLoading ? '처리중...' : confirmText}
      </ConfirmButton>
    </ButtonGroup>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      {content}
    </Modal>
  );
}
