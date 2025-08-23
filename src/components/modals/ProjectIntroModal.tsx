'use client';

import styled, { keyframes } from 'styled-components';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IMAGES } from '@/assets';

interface ProjectIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'trivus' | 'elo' | 'community';
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

const ModalContent = styled.div<{
  isOpen: boolean;
  isClosing: boolean;
  $currentType: 'trivus' | 'elo' | 'community';
}>`
  background: white;
  color: inherit;
  width: 100%;
  max-width: 768px;
  max-height: 80vh;
  border-radius: 52px 52px 0 0;
  padding: 42px 28px 24px;
  overflow-y: auto;
  animation: ${props => (props.isClosing ? slideDown : slideUp)} 0.3s ease-out;
  position: relative;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 99999;
  transition: color 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 32px;
  right: 32px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
    color: #333;
    transform: scale(1.1);
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const MainSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3<{
  $currentType: 'trivus' | 'elo' | 'community';
}>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MainSectionTitle = styled.h3<{
  $currentType: 'trivus' | 'elo' | 'community';
}>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 16px;
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const SectionContent = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin: 0;
  text-align: justify;
  word-break: keep-all;
  word-wrap: break-word;
`;

const FeatureList = styled.ul`
  margin: 16px 0 0 0;
`;

const FeatureItem = styled.li`
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 12px;
`;

const Highlight = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 700;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const CTAButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props =>
    props.$variant === 'secondary'
      ? 'transparent'
      : props.theme.colors.primary};
  color: ${props =>
    props.$variant === 'secondary' ? props.theme.colors.primary : 'white'};
  border: ${props =>
    props.$variant === 'secondary'
      ? `2px solid ${props.theme.colors.primary}`
      : 'none'};
  border-radius: 12px;
  padding: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    background: ${props =>
      props.$variant === 'secondary'
        ? '#e8f5e8'
        : props.theme.colors.primaryDark || props.theme.colors.primary};
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function ProjectIntroModal({
  isOpen,
  onClose,
  initialType = 'trivus',
}: ProjectIntroModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [currentType, setCurrentType] = useState<
    'trivus' | 'elo' | 'community'
  >(initialType);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setCurrentType(initialType);
    }
  }, [isOpen, initialType]);

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

  const handleTypeChange = (newType: 'trivus' | 'elo' | 'community') => {
    if (newType === currentType) return;
    setCurrentType(newType);
  };

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent
        isOpen={isOpen}
        isClosing={isClosing}
        $currentType={currentType}
      >
        <CloseButton onClick={handleClose}>×</CloseButton>

        {currentType === 'trivus' && (
          <>
            <Section>
              <SectionTitle $currentType={currentType}>
                <Image
                  src={IMAGES.LOGO_TRIVUS}
                  alt="Trivus Logo"
                  width={40}
                  height={40}
                  style={{ marginRight: '2px' }}
                />
                Trivus
              </SectionTitle>
              <SectionContent>
                <Highlight>Trivus</Highlight>는 오프라인 스포츠 활동을 기록하고{' '}
                <br />
                ELO 점수로 관리하는 보상형 커뮤니티 플랫폼이에요.
              </SectionContent>
            </Section>

            <MainSection>
              <MainSectionTitle $currentType={currentType}>
                핵심 구조
              </MainSectionTitle>
              <FeatureList>
                <FeatureItem>
                  <Highlight>오프라인 활동 기록</Highlight>: 실제 경기 결과를
                  등록해서 프로필을 관리해요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>ELO 보드</Highlight>: 실력에 따른 점수 관리와 자동
                  매칭을 제공해요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>보상형 커뮤니티</Highlight>: 글 작성과 좋아요로
                  모두가 수익을 얻을 수 있어요
                </FeatureItem>
              </FeatureList>
            </MainSection>

            <Section>
              <SectionTitle $currentType={currentType}>목표</SectionTitle>
              <SectionContent>
                스포츠를 통해 사람들을 연결하고, 참여할수록 보상을 받는
                <br /> 새로운 스포츠 생태계를 만들어가고 있어요.
              </SectionContent>
            </Section>
          </>
        )}

        {currentType === 'elo' && (
          <>
            <Section>
              <SectionTitle $currentType={currentType}>
                <Image
                  src={IMAGES.LOGO_TRIVUS}
                  alt="Trivus 로고"
                  width={40}
                  height={40}
                  style={{ marginRight: '2px' }}
                />
                ELO 보드
              </SectionTitle>
              <SectionContent>
                <Highlight>ELO</Highlight>는 체스에서 쓰이던 실력 평가
                방식이에요.
                <br />
                경기 결과에 따라 점수가 오르내리며, 실력을 비교할 수 있는 기준이
                돼요.
              </SectionContent>
            </Section>

            <MainSection>
              <MainSectionTitle $currentType={currentType}>
                사용 가이드
              </MainSectionTitle>
              <FeatureList>
                <FeatureItem>
                  <Highlight>1. 오프라인 활동</Highlight>: 실제 경기를 진행해요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>2. 결과 등록</Highlight>: 경기 종목, 결과를
                  입력해요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>3. 상대 승인</Highlight>: 상대방이 결과를 승인하면
                  점수가 반영돼요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>4. 점수 반영</Highlight>: 승패에 따라 ELO 점수가
                  자동으로 계산돼요
                </FeatureItem>
              </FeatureList>
            </MainSection>

            <MainSection>
              <MainSectionTitle $currentType={currentType}>
                ELO 보드의 특징
              </MainSectionTitle>
              <FeatureList>
                <FeatureItem>
                  <Highlight>객관적 기록</Highlight>: 경기 결과를 점수로 환산해
                  실력을 객관적으로 기록해요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>공정한 기준</Highlight>: 상대의 ELO 점수를
                  기준으로, 승패에 따른 점수 변동폭이 달라져요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>성장 추적</Highlight>: 점수 변화를 통해 실력 향상
                  과정을 한눈에 확인할 수 있어요
                </FeatureItem>
              </FeatureList>
            </MainSection>
          </>
        )}

        {currentType === 'community' && (
          <>
            <Section>
              <SectionTitle $currentType={currentType}>
                <Image
                  src={IMAGES.LOGO_TRIVUS}
                  alt="Trivus 로고"
                  width={40}
                  height={40}
                  style={{ marginRight: '2px' }}
                />
                보상형 커뮤니티
              </SectionTitle>
              <SectionContent>
                <Highlight>보상형 커뮤니티</Highlight>는 사용자들의 참여와
                기여를 토큰으로 보상하는 혁신적인 시스템이에요.
              </SectionContent>
            </Section>

            <MainSection>
              <MainSectionTitle $currentType={currentType}>
                사용 가이드
              </MainSectionTitle>
              <FeatureList>
                <FeatureItem>
                  <Highlight>1. 콘텐츠 작성</Highlight>: 매치 후기, 팁 공유,
                  질문 등을 작성해요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>2. 상호작용</Highlight>: 좋아요, 댓글 등으로 다른
                  사용자와 소통해요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>3. 보상 획득</Highlight>: 참여도에 따라 토큰을
                  자동으로 받아요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>4. 커뮤니티 성장</Highlight>: 모두가 함께
                  만들어가는 활발한 공간이에요
                </FeatureItem>
              </FeatureList>
            </MainSection>

            <MainSection>
              <MainSectionTitle $currentType={currentType}>
                보상형 커뮤니티의 특징
              </MainSectionTitle>
              <FeatureList>
                <FeatureItem>
                  <Highlight>콘텐츠 보상</Highlight>: 유용한 글 작성 시 토큰을
                  자동으로 지급해요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>참여 보상</Highlight>: 좋아요, 댓글 등 적극적 참여
                  시 즉시 보상을 받을 수 있어요
                </FeatureItem>
                <FeatureItem>
                  <Highlight>공정한 분배</Highlight>: 투명한 알고리즘으로 보상을
                  공정하게 분배해요
                </FeatureItem>
              </FeatureList>
            </MainSection>
          </>
        )}

        <ButtonContainer>
          {currentType === 'trivus' && (
            <>
              <CTAButton onClick={() => handleTypeChange('elo')}>
                ELO 보드 알아보기
              </CTAButton>
              <CTAButton
                onClick={() => handleTypeChange('community')}
                $variant="secondary"
              >
                보상형 커뮤니티 알아보기
              </CTAButton>
            </>
          )}

          {currentType === 'elo' && (
            <>
              <CTAButton onClick={() => handleTypeChange('community')}>
                보상형 커뮤니티 알아보기
              </CTAButton>
              <CTAButton
                onClick={() => handleTypeChange('trivus')}
                $variant="secondary"
              >
                Trivus 알아보기
              </CTAButton>
            </>
          )}

          {currentType === 'community' && (
            <>
              <CTAButton onClick={() => handleTypeChange('elo')}>
                ELO 보드 알아보기
              </CTAButton>
              <CTAButton
                onClick={() => handleTypeChange('trivus')}
                $variant="secondary"
              >
                Trivus 알아보기
              </CTAButton>
            </>
          )}
        </ButtonContainer>
      </ModalContent>
    </Overlay>
  );
}
