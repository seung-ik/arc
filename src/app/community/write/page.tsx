'use client';

import styled from 'styled-components';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityLayout from '@/components/CommunityLayout';
import { ROUTES } from '@/constants/routes';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
  padding: ${(props) => props.theme.spacing.sm};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  border: 1px solid ${(props) => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
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
  gap: ${(props) => props.theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textBlack};
`;

const Input = styled.input`
  padding: ${(props) => props.theme.spacing.sm};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textBlack};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textGray};
  }
`;

const TextArea = styled.textarea`
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textBlack};
  resize: vertical;
  min-height: 400px;
  font-family: inherit;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textGray};
  }
`;

const Select = styled.select`
  padding: ${(props) => props.theme.spacing.sm};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textBlack};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const TopFormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
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
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xl};
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ModalMessage = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  color: ${(props) => props.theme.colors.textGray};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  justify-content: center;
`;

const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  border: 1px solid ${(props) => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
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
  { value: '질문', label: '질문' },
  { value: '후기', label: '후기' },
  { value: '팁', label: '팁' },
  { value: '정보', label: '정보' },
  { value: '모집', label: '모집' },
  { value: '추천', label: '추천' },
  { value: '분석', label: '분석' },
  { value: '일상', label: '일상' },
];

// 카테고리 옵션
const CATEGORIES = [
  { value: 'tennis', label: '테니스' },
  { value: 'badminton', label: '배드민턴' },
  { value: 'table-tennis', label: '탁구' },
  { value: 'billiards', label: '당구' },
  { value: 'go', label: '바둑' },
  { value: 'chess', label: '체스' },
];

function WritePostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || '';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postType: '',
    category: defaultCategory,
  });

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
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

    // TODO: API 호출하여 글 작성
    console.log('글 작성:', formData);

    // 작성 완료 후 해당 카테고리 페이지로 이동
    const categoryPath =
      formData.category === 'tennis'
        ? ROUTES.community.tennis
        : formData.category === 'badminton'
        ? ROUTES.community.badminton
        : formData.category === 'table-tennis'
        ? ROUTES.community.tableTennis
        : formData.category === 'billiards'
        ? ROUTES.community.billiards
        : formData.category === 'go'
        ? ROUTES.community.go
        : formData.category === 'chess'
        ? ROUTES.community.chess
        : ROUTES.community.root;

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
      <CategoryTabs />
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
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  required
                >
                  <option value="">카테고리를 선택하세요</option>
                  {CATEGORIES.map((category) => (
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
                  onChange={(e) => handleInputChange('postType', e.target.value)}
                  required
                >
                  <option value="">글타입을 선택하세요</option>
                  {POST_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </TopFormGroup>

            <FormGroup>
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="제목을 입력하세요"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="content">내용 *</Label>
              <TextArea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="내용을 입력하세요"
                required
              />
            </FormGroup>
          </Form>
        </Content>
      </CommunityLayout>

      {showCancelModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>작성을 취소하시겠습니까?</ModalTitle>
            <ModalMessage>작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?</ModalMessage>
            <ModalButtonGroup>
              <ModalButton onClick={handleContinueWriting}>계속 작성</ModalButton>
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
