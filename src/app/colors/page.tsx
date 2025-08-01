'use client';

import styled from 'styled-components';
import { useModal } from '@/hooks/useModal';
import OneButtonModal from '@/components/OneButtonModal';
import TwoButtonModal from '@/components/TwoButtonModal';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background};
  gap: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.textBlack};
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.normal};
`;

const ColorExample = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const ColorBox = styled.div<{ bgColor: string; textColor: string }>`
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  min-width: 120px;
  text-align: center;
`;

const ModalExample = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const ModalButton = styled.button`
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

export default function ColorsPage() {
  const oneButtonModal = useModal();
  const twoButtonModal = useModal();

  const handleTwoButtonSubmit = () => {
    // 실제 제출 로직을 여기에 구현
    twoButtonModal.closeModal();
  };

  return (
    <Container>
      <Title>Colors Page</Title>
      <Subtitle>테마 색상 예시</Subtitle>
      <ColorExample>
        <ColorBox bgColor="#0070f3" textColor="#ffffff">
          Primary
        </ColorBox>
        <ColorBox bgColor="#6c757d" textColor="#ffffff">
          Secondary
        </ColorBox>
        <ColorBox bgColor="#28a745" textColor="#ffffff">
          Success
        </ColorBox>
        <ColorBox bgColor="#dc3545" textColor="#ffffff">
          Error
        </ColorBox>
        <ColorBox bgColor="#f8f9fa" textColor="#000000">
          Background Gray
        </ColorBox>
        <ColorBox bgColor="#e1e1e1" textColor="#000000">
          Border
        </ColorBox>
      </ColorExample>

      <Subtitle>모달 예시</Subtitle>
      <ModalExample>
        <ModalButton onClick={oneButtonModal.openModal}>
          One Button Modal
        </ModalButton>
        <ModalButton onClick={twoButtonModal.openModal}>
          Two Button Modal
        </ModalButton>
      </ModalExample>

      <OneButtonModal
        isOpen={oneButtonModal.isOpen}
        onClose={oneButtonModal.closeModal}
        title="One Button Modal"
        content="이것은 하나의 버튼만 있는 모달입니다. 확인 버튼을 누르면 모달이 닫힙니다."
        confirmText="확인"
      />

      <TwoButtonModal
        isOpen={twoButtonModal.isOpen}
        onClose={twoButtonModal.closeModal}
        title="Two Button Modal"
        content="이것은 두 개의 버튼이 있는 모달입니다. 취소 버튼을 누르면 모달이 닫히고, 확인 버튼을 누르면 제출 핸들러가 실행됩니다."
        cancelText="취소"
        confirmText="확인"
        onSubmit={handleTwoButtonSubmit}
      />
    </Container>
  );
}
