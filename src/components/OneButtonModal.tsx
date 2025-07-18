'use client';

import styled from 'styled-components';
import Modal from './Modal';

const ConfirmButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textWhite};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }

  &:active {
    transform: translateY(1px);
  }
`;

interface OneButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  confirmText?: string;
}

export default function OneButtonModal({
  isOpen,
  onClose,
  title,
  content,
  confirmText = '확인',
}: OneButtonModalProps) {
  const handleConfirm = () => {
    onClose();
  };

  const footer = (
    <ConfirmButton onClick={handleConfirm}>{confirmText}</ConfirmButton>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      {content}
    </Modal>
  );
}
