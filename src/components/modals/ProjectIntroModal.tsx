'use client';

import styled, { keyframes } from 'styled-components';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IMAGES } from '@/assets';

interface ProjectIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: flex-end;
  justify-content: center;
`;

const ModalContent = styled.div<{ isOpen: boolean; isClosing: boolean }>`
  background: white;
  width: 100%;
  max-width: 768px;
  max-height: 70vh;
  border-radius: 52px 52px 0 0;
  padding: 60px 30px 24px;
  overflow-y: auto;
  animation: ${props => (props.isClosing ? slideDown : slideUp)} 0.3s ease-out;
  position: relative;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 99999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 32px;
  right: 32px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1976d2;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionContent = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  margin: 0;
  text-align: justify;
  word-break: keep-all;
  word-wrap: break-word;
`;

const FeatureList = styled.ul`
  margin: 12px 0 0 0;
`;

const FeatureItem = styled.li`
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 8px;
`;

const Highlight = styled.span`
  color: #1976d2;
  font-weight: 600;
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

export default function ProjectIntroModal({
  isOpen,
  onClose,
}: ProjectIntroModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent isOpen={isOpen} isClosing={isClosing}>
        <CloseButton onClick={handleClose}>×</CloseButton>

        <Section>
          <SectionTitle>
            <Image
              src={IMAGES.LOGO_TRIVUS}
              alt="Trivus Logo"
              width={32}
              height={32}
              style={{ marginRight: '2px' }}
            />
            Trivus 소개
          </SectionTitle>
          <SectionContent>
            <Highlight>Trivus</Highlight>는 오프라인 스포츠 활동을 기록하고 ELO
            점수로 관리하는 보상형 커뮤니티 플랫폼입니다.
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>핵심 구조</SectionTitle>
          <FeatureList>
            <FeatureItem>
              <Highlight>오프라인 활동 기록</Highlight>: 실제 경기 결과를
              등록하여 프로필 관리
            </FeatureItem>
            <FeatureItem>
              <Highlight>ELO 시스템</Highlight>: 실력에 따른 점수 관리와 매칭
            </FeatureItem>
            <FeatureItem>
              <Highlight>보상형 커뮤니티</Highlight>: 글 작성과 좋아요로 모두가
              수익
            </FeatureItem>
          </FeatureList>
        </Section>

        <Section>
          <SectionTitle>목표</SectionTitle>
          <SectionContent>
            스포츠를 통해 사람들을 연결하고, 참여할수록 보상을 받는 새로운
            스포츠 생태계를 만들어갑니다.
          </SectionContent>
        </Section>

        <CTAButton onClick={handleClose}>프로젝트 둘러보기</CTAButton>
      </ModalContent>
    </Overlay>
  );
}
