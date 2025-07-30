'use client';

import styled from 'styled-components';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityLayout from '@/components/CommunityLayout';
import { getCategoryPath, getCategoryLabel } from '@/lib/utils/categoryPath';
import { useCreatePostMutation } from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';
import dynamic from 'next/dynamic';

const ToastEditor = dynamic(() => import('@/components/ToastEditor'), {
  ssr: false,
});

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s;

  ${props =>
    props.$variant === 'primary'
      ? `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.textWhite};
    &:hover {
      background-color: ${props.theme.colors.primaryHover};
    }
  `
      : `
    background-color: transparent;
    color: ${props.theme.colors.textBlack};
    &:hover {
      background-color: ${props.theme.colors.background};
    }
  `}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textBlack};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textGray};
  }
`;

const ShortTextArea = styled.textarea`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textBlack};
  resize: vertical;
  min-height: 80px;
  max-height: 120px;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textGray};
  }
`;

const CharCount = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
  text-align: right;
  margin-top: ${props => props.theme.spacing.xs};
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textBlack};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TopFormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ModalMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.textGray};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  justify-content: center;
`;

const MentorFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
`;

const FieldDescription = styled.div`
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const FieldLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.xs};
  display: block;
`;

const FieldHelp = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
  font-style: italic;
`;

const MatchFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const TimeLocationRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
`;

const ValidityPeriodSection = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
`;

const ValidityTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ValidityCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ValidityCard = styled.div<{ $selected?: boolean }>`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid
    ${props =>
      props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props =>
    props.$selected
      ? props.theme.colors.primaryLight
      : props.theme.colors.background};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primaryLight};
  }
`;

const ValidityPeriod = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ValidityToken = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const TokenInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const TokenLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
`;

const TokenAmount = styled.span<{ $insufficient?: boolean }>`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props =>
    props.$insufficient
      ? props.theme.colors.error
      : props.theme.colors.primary};
`;

const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s;

  ${props =>
    props.$variant === 'primary'
      ? `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.textWhite};
    &:hover {
      background-color: ${props.theme.colors.primaryHover};
    }
  `
      : `
    background-color: transparent;
    color: ${props.theme.colors.textBlack};
    &:hover {
      background-color: ${props.theme.colors.background};
    }
  `}
`;

// 글타입 옵션
const POST_TYPES = [
  { value: '일반', label: '일반' },
  { value: '매치', label: '매치' },
  { value: '멘토', label: '멘토' },
];

// 유효기간 옵션
const VALIDITY_PERIODS = [
  { value: '1', label: '1일', token: 1 },
  { value: '3', label: '3일', token: 2 },
  { value: '7', label: '7일', token: 5 },
];

function WritePostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || '';
  const { communityTabs } = useCommunityStore();
  const createPostMutation = useCreatePostMutation();

  // 카테고리 옵션 - communityTabs에서 동적으로 생성
  const categories = Object.values(communityTabs).map(tab => ({
    value: tab.id,
    label: tab.name,
  }));

  const currentLabel = getCategoryLabel(defaultCategory);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postType: '일반',
    category: defaultCategory,
    sport: '',
    customSport: '',
    elo: '',
    location: '',
    tokenReward: '',
    // 매치 관련 필드
    matchLocation: '',
    myElo: '',
    preferredElo: '',
    validityPeriod: '',
  });

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.postType ||
      !formData.category
    ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 글 타입별로 다른 처리
    switch (formData.postType) {
      case '일반':
        handleGeneralSubmit();
        break;
      case '매치':
        handleMatchSubmit();
        break;
      case '멘토':
        handleMentorSubmit();
        break;
      default:
        alert('올바른 글 타입을 선택해주세요.');
        return;
    }
  };

  const handleGeneralSubmit = () => {
    // 일반 글 작성
    const generalData = {
      sportCategoryId: parseInt(formData.category, 10),
      title: formData.title,
      content: formData.content,
      type: formData.postType,
    };

    console.log('일반 글 작성 요청:', generalData);

    createPostMutation.mutate(generalData, {
      onSuccess: data => {
        console.log('글 작성 성공 응답:', data);
        navigateToCategory();
      },
      onError: error => {
        console.error('글 작성 실패:', error);
        alert('글 작성에 실패했습니다.');
      },
    });
  };

  const handleMatchSubmit = () => {
    alert('준비중 입니다.');
    return;
    // 매치 글 필드 검증
    if (!formData.validityPeriod) {
      alert('매칭 요청에 필요한 모든 정보를 입력해주세요.');
      return;
    }

    // 매치 글 작성
    const matchData = {
      title: formData.title,
      content: formData.content,
      postType: formData.postType,
      category: formData.category,
      matchLocation: formData.matchLocation,
      myElo: formData.myElo,
      preferredElo: formData.preferredElo,
      validityPeriod: formData.validityPeriod,
    };

    console.log('매치 글 작성:', matchData);
    // TODO: 매치 글 API 호출
    navigateToCategory();
  };

  const handleMentorSubmit = () => {
    alert('준비중 입니다.');
    return;
    // 멘토 글 필드 검증
    if (
      !formData.sport ||
      !formData.elo ||
      !formData.location ||
      !formData.tokenReward
    ) {
      alert('멘토링 요청에 필요한 모든 정보를 입력해주세요.');
      return;
    }

    // 직접 입력한 경우 customSport도 확인
    if (formData.sport === '직접입력' && !formData.customSport.trim()) {
      alert('종목을 직접 입력해주세요.');
      return;
    }

    // 멘토 글 작성
    const mentorData = {
      title: formData.title,
      content: formData.content,
      postType: formData.postType,
      category: formData.category,
      sport:
        formData.sport === '직접입력' ? formData.customSport : formData.sport,
      elo: formData.elo,
      location: formData.location,
      tokenReward: formData.tokenReward,
    };

    console.log('멘토 글 작성:', mentorData);
    // TODO: 멘토 글 API 호출
    navigateToCategory();
  };

  const navigateToCategory = () => {
    // 작성 완료 후 해당 카테고리 페이지로 이동
    const categoryPath = getCategoryPath(formData.category);
    router.push(categoryPath);
  };

  const handleCancel = () => {
    // 내용이 있으면 확인 모달 표시
    if (formData.title.trim() || formData.content.trim()) {
      setShowCancelModal(true);
    } else {
      router.back();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    router.back();
  };

  const handleContinueWriting = () => {
    setShowCancelModal(false);
  };

  return (
    <Container>
      <CategoryTabs currentLabel={currentLabel} />
      <CommunityLayout>
        <Content>
          <Header>
            <Title>글쓰기</Title>
            <ButtonGroup>
              <Button onClick={handleCancel}>취소</Button>
              <Button $variant="primary" onClick={handleSubmit}>
                작성완료
              </Button>
            </ButtonGroup>
          </Header>

          <Form onSubmit={handleSubmit}>
            <TopFormGroup>
              <FormGroup>
                <Label htmlFor="category">카테고리 *</Label>
                <Select
                  id="category"
                  value={formData.category}
                  onChange={e => handleInputChange('category', e.target.value)}
                  required
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="postType">글타입 *</Label>
                <Select
                  id="postType"
                  value={formData.postType}
                  onChange={e => handleInputChange('postType', e.target.value)}
                  required
                >
                  <option value="">글타입을 선택하세요</option>
                  {POST_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </TopFormGroup>

            {formData.postType === '멘토' && (
              <>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                    border: '1px solid #2196f3',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      color: '#2196f3',
                      margin: '0 0 8px 0',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    📚 멘토링 요청 안내
                  </h3>
                  <p
                    style={{
                      color: '#666',
                      margin: 0,
                      fontSize: '14px',
                      lineHeight: '1.5',
                    }}
                  >
                    멘토링을 받고 싶은 종목, 희망하는 멘토의 실력 수준, 지역,
                    보상 토큰 등을 상세히 작성해주세요. 멘토가 요청을 보고
                    연락을 드릴 예정입니다.
                  </p>
                </div>

                <MentorFields>
                  <FieldRow>
                    <FormGroup>
                      <FieldDescription>
                        <FieldLabel htmlFor="sport">종목 *</FieldLabel>
                        <FieldHelp>
                          멘토링을 받고 싶은 종목을 선택하거나 직접 입력하세요
                        </FieldHelp>
                      </FieldDescription>
                      <Select
                        id="sport"
                        value={formData.sport || ''}
                        onChange={e =>
                          handleInputChange('sport', e.target.value)
                        }
                        required
                      >
                        <option value="">종목 선택</option>
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                        <option value="직접입력">직접 입력</option>
                      </Select>
                      {formData.sport === '직접입력' && (
                        <Input
                          type="text"
                          value={formData.customSport || ''}
                          onChange={e =>
                            handleInputChange('customSport', e.target.value)
                          }
                          placeholder="종목을 직접 입력하세요"
                          style={{ marginTop: '8px' }}
                          required
                        />
                      )}
                    </FormGroup>

                    <FormGroup>
                      <FieldDescription>
                        <FieldLabel htmlFor="elo">희망 멘토 실력 *</FieldLabel>
                        <FieldHelp>희망하는 멘토의 최소 실력 수준</FieldHelp>
                      </FieldDescription>
                      <Select
                        id="elo"
                        value={formData.elo || ''}
                        onChange={e => handleInputChange('elo', e.target.value)}
                        required
                      >
                        <option value="">실력 선택</option>
                        <option value="1000-1200">1000-1200 (초급)</option>
                        <option value="1200-1400">1200-1400 (중급)</option>
                        <option value="1400-1600">1400-1600 (고급)</option>
                        <option value="1600+">1600+ (전문가)</option>
                      </Select>
                    </FormGroup>
                  </FieldRow>

                  <FieldRow>
                    <FormGroup>
                      <FieldDescription>
                        <FieldLabel htmlFor="location">지역 *</FieldLabel>
                        <FieldHelp>멘토링을 받을 수 있는 지역</FieldHelp>
                      </FieldDescription>
                      <Input
                        id="location"
                        type="text"
                        value={formData.location || ''}
                        onChange={e =>
                          handleInputChange('location', e.target.value)
                        }
                        placeholder="예: 서울 강남구"
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <FieldDescription>
                        <FieldLabel htmlFor="tokenReward">
                          보상 토큰 *
                        </FieldLabel>
                        <FieldHelp>
                          멘토에게 지급할 토큰 수량 (숫자만 입력)
                        </FieldHelp>
                      </FieldDescription>
                      <Input
                        id="tokenReward"
                        type="number"
                        value={formData.tokenReward || ''}
                        onChange={e => {
                          const value = e.target.value;
                          // 숫자만 허용
                          if (value === '' || /^\d+$/.test(value)) {
                            handleInputChange('tokenReward', value);
                          }
                        }}
                        onKeyPress={e => {
                          // 숫자와 백스페이스, 화살표 키만 허용
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== 'Backspace' &&
                            e.key !== 'Delete' &&
                            e.key !== 'ArrowLeft' &&
                            e.key !== 'ArrowRight'
                          ) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="예: 100"
                        min="1"
                        required
                      />
                    </FormGroup>
                  </FieldRow>
                </MentorFields>
              </>
            )}

            {formData.postType === '매치' && (
              <>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
                    border: '1px solid #4caf50',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      color: '#4caf50',
                      margin: '0 0 8px 0',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    🏓 매칭 요청 안내
                  </h3>
                  <p
                    style={{
                      color: '#666',
                      margin: 0,
                      fontSize: '14px',
                      lineHeight: '1.5',
                    }}
                  >
                    매칭을 원하는 장소, 상대 실력을 설정하고 유효기간을
                    선택하세요. AI 추천 시스템을 통해 적합한 상대를
                    찾아드립니다.
                  </p>
                </div>

                <MatchFields>
                  <FormGroup>
                    <FieldDescription>
                      <FieldLabel htmlFor="matchLocation">선호 장소</FieldLabel>
                      <FieldHelp>
                        매칭을 원하는 장소를 입력하세요 (선택사항)
                      </FieldHelp>
                    </FieldDescription>
                    <Input
                      id="matchLocation"
                      type="text"
                      value={formData.matchLocation}
                      onChange={e =>
                        handleInputChange('matchLocation', e.target.value)
                      }
                      placeholder="예: 강남구 테니스장, 협의 가능"
                    />
                  </FormGroup>

                  <TimeLocationRow>
                    <FormGroup>
                      <FieldDescription>
                        <FieldLabel htmlFor="myElo">내 실력 (Elo)</FieldLabel>
                        <FieldHelp>현재 Elo 점수를 입력하세요</FieldHelp>
                      </FieldDescription>
                      <Input
                        id="myElo"
                        type="number"
                        value={formData.myElo}
                        onChange={e =>
                          handleInputChange('myElo', e.target.value)
                        }
                        placeholder="예: 1200"
                        min="0"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FieldDescription>
                        <FieldLabel htmlFor="preferredElo">
                          희망 상대 실력
                        </FieldLabel>
                        <FieldHelp>희망하는 상대의 실력 범위</FieldHelp>
                      </FieldDescription>
                      <Select
                        id="preferredElo"
                        value={formData.preferredElo}
                        onChange={e =>
                          handleInputChange('preferredElo', e.target.value)
                        }
                      >
                        <option value="">실력 무관</option>
                        <option value="similar">비슷한 실력</option>
                        <option value="higher">더 높은 실력</option>
                        <option value="lower">더 낮은 실력</option>
                        <option value="any">모든 실력</option>
                      </Select>
                    </FormGroup>
                  </TimeLocationRow>
                </MatchFields>

                <ValidityPeriodSection>
                  <ValidityTitle>유효기간 선택 *</ValidityTitle>
                  <ValidityCards>
                    {VALIDITY_PERIODS.map(period => (
                      <ValidityCard
                        key={period.value}
                        $selected={formData.validityPeriod === period.value}
                        onClick={() =>
                          handleInputChange('validityPeriod', period.value)
                        }
                      >
                        <ValidityPeriod>{period.label}</ValidityPeriod>
                        <ValidityToken>{period.token} 토큰</ValidityToken>
                      </ValidityCard>
                    ))}
                  </ValidityCards>

                  <TokenInfo>
                    <TokenLabel>필요 토큰:</TokenLabel>
                    <TokenAmount $insufficient={false}>
                      {formData.validityPeriod
                        ? VALIDITY_PERIODS.find(
                            p => p.value === formData.validityPeriod
                          )?.token || 0
                        : 0}{' '}
                      토큰
                    </TokenAmount>
                  </TokenInfo>
                </ValidityPeriodSection>
              </>
            )}

            <FormGroup>
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                placeholder={
                  formData.postType === '멘토'
                    ? '예: 테니스 초보자 멘토링 요청합니다'
                    : formData.postType === '매치'
                      ? '예: 테니스 매칭 구합니다'
                      : '제목을 입력하세요'
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="content">내용 *</Label>
              {formData.postType === '매치' || formData.postType === '멘토' ? (
                <>
                  <ShortTextArea
                    id="content"
                    value={formData.content}
                    onChange={e => {
                      const value = e.target.value;
                      if (value.length <= 80) {
                        handleInputChange('content', value);
                      }
                    }}
                    placeholder={
                      formData.postType === '매치'
                        ? '매칭 요청 내용을 간단히 입력하세요 (80자 이내)'
                        : '멘토링 요청 내용을 간단히 입력하세요 (80자 이내)'
                    }
                    maxLength={80}
                    required
                  />
                  <CharCount>{formData.content.length}/80</CharCount>
                </>
              ) : (
                <ToastEditor
                  value={formData.content}
                  onChange={value => handleInputChange('content', value)}
                  height="400px"
                  placeholder="내용을 입력하세요"
                  initialEditType="wysiwyg"
                />
              )}
            </FormGroup>
          </Form>
        </Content>
      </CommunityLayout>

      {showCancelModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>작성을 취소하시겠습니까?</ModalTitle>
            <ModalMessage>
              작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?
            </ModalMessage>
            <ModalButtonGroup>
              <ModalButton onClick={handleContinueWriting}>
                계속 작성
              </ModalButton>
              <ModalButton $variant="primary" onClick={handleConfirmCancel}>
                취소하기
              </ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </Modal>
      )}

      <BottomNavigation />
    </Container>
  );
}

export default function WritePostPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <WritePostForm />
    </Suspense>
  );
}
