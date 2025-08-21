'use client';

import styled from 'styled-components';
import { useState, Suspense, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';

import { getCategoryPath } from '@/lib/utils/categoryPath';
import {
  useCreatePostMutation,
  useCreateMatchPostMutation,
  validateGeneralPost,
  validateMatchPost,
  validateMentorPost,
} from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';
import dynamic from 'next/dynamic';
import MatchPostFormSection from './components/MatchPostFormSection';
import MentorPostFormSection from './components/MentorPostFormSection';
import ShortContentInput from './components/ShortContentInput';
import CancelConfirmModal from '@/components/modals/CancelConfirmModal';
import { useImageUploadMutation } from '@/api/useCommunity';

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
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  height: 100%;
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
  height: 100%;
`;

const EditorWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  height: 100%;
  min-height: 400px;
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

// 글타입 옵션
const POST_TYPES = [
  { value: '일반', label: '일반' },
  { value: '매치', label: '매치' },
  // { value: '멘토', label: '멘토' },
];

function WritePostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { communityTabs } = useCommunityStore();
  const createPostMutation = useCreatePostMutation();
  const queryClient = useQueryClient();

  // 카테고리 옵션 - communityTabs에서 동적으로 생성 (공지사항 제외)
  const categories = Object.values(communityTabs)
    .filter(tab => tab.name !== '공지사항')
    .map(tab => ({
      value: String(tab.id),
      label: tab.name,
    }));

  // URL 파라미터에서 카테고리 이름을 가져와서 해당 ID로 매핑
  const categoryParam = searchParams.get('category') || '';

  // 영어-한국어 카테고리 매핑
  const categoryMapping: Record<string, string> = {
    tennis: '테니스',
    badminton: '배드민턴',
    'table-tennis': '탁구',
    billiards: '당구',
    go: '바둑',
    chess: '체스',
    notice: '공지사항',
    free: '자유글',
  };

  const mappedCategory = categoryMapping[categoryParam.toLowerCase()];

  const defaultCategory = useMemo(() => {
    if (categoryParam) {
      return (
        categories.find(
          cat =>
            cat.label.toLowerCase() ===
            (mappedCategory || categoryParam.toLowerCase())
        )?.value || ''
      );
    } else {
      // category 파라미터가 없으면 자유글을 기본값으로 설정
      return categories.find(cat => cat.label === '자유글')?.value || '';
    }
  }, [categoryParam, categories, mappedCategory]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postType: '일반',
    category: '',
    sport: '',
    customSport: '',
    elo: '',
    location: '',
    tokenReward: '',
    // 매치 관련 필드
    matchLocation: '',
    myElo: '',
    preferredElo: 'any',
    validityPeriod: '',
    participantCount: '', // 참가 인원 필드 추가
    customParticipantCount: '', // 직접 입력 필드 추가
    matchDate: '', // 매치 날짜 필드 추가
  });

  // defaultCategory가 변경될 때 formData.category 업데이트
  useEffect(() => {
    if (defaultCategory && !formData.category) {
      setFormData(prev => ({
        ...prev,
        category: defaultCategory,
      }));
    }
  }, [defaultCategory, formData.category]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const imageUploadMutation = useImageUploadMutation();

  // 매치글 작성 뮤테이션
  const createMatchPostMutation = useCreateMatchPostMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      // postType이 바뀔 때 content 초기화
      if (field === 'postType') {
        return {
          ...prev,
          [field]: value,
          content: '', // postType 변경 시 content 초기화
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
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
    // 일반 글 검증
    if (!validateGeneralPost(formData)) {
      return;
    }

    // 일반 글 작성
    const generalData = {
      sportCategoryId: parseInt(formData.category, 10),
      title: formData.title,
      content: formData.content,
      type: formData.postType,
    };

    createPostMutation.mutate(generalData, {
      onSuccess: data => {
        console.log('글 작성 성공 응답:', data);
        // 해당 카테고리의 게시글 목록과 내가 쓴 글 목록 무효화
        queryClient.invalidateQueries({
          queryKey: ['posts', Number(formData.category)],
        });
        queryClient.invalidateQueries({
          queryKey: ['my-posts'],
        });
        navigateToCategory();
      },
      onError: error => {
        console.error('글 작성 실패:', error);
        alert('글 작성에 실패했습니다.');
      },
    });
  };

  const handleMatchSubmit = () => {
    // 매치 글 검증
    if (!validateMatchPost(formData)) {
      return;
    }

    // 매치 글 작성
    const matchData = {
      sportCategoryId: parseInt(formData.category) || 0,
      title: formData.title,
      content: formData.content,
      type: formData.postType,
      matchLocation: formData.matchLocation,
      myElo: parseInt(formData.myElo) || 0,
      preferredElo: formData.preferredElo,
      participantCount: formData.participantCount || '2',
      matchDate: formData.matchDate || undefined, // 매치 날짜 추가
    };

    console.log('매치 글 작성:', matchData);

    // 매치 글 API 호출
    createMatchPostMutation.mutate(matchData, {
      onSuccess: data => {
        console.log('매치글 작성 성공:', data);
        alert('매치글이 성공적으로 작성되었습니다!');
        navigateToCategory();
      },
      onError: error => {
        console.error('매치글 작성 실패:', error);
        alert('매치글 작성에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  const handleMentorSubmit = () => {
    // 멘토 글 검증
    if (!validateMentorPost(formData)) {
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
    const categoryName = categories.filter(
      el => el.value === formData.category
    )[0].label;
    const categoryPath = getCategoryPath(categoryName);
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

  // 이미지 업로드 핸들러
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const result = await imageUploadMutation.mutateAsync({ image: file });
      return result.imageUrl;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw error;
    }
  };

  console.log(formData);

  return (
    <Container>
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

        <Form onSubmit={handleSubmit} style={{ flex: 1 }}>
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
            <MentorPostFormSection
              formData={formData}
              onInputChange={handleInputChange}
              categories={categories}
            />
          )}

          {formData.postType === '매치' && (
            <MatchPostFormSection
              formData={formData}
              onInputChange={handleInputChange}
            />
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

          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="content">내용 *</Label>
            {formData.postType === '매치' || formData.postType === '멘토' ? (
              <ShortContentInput
                value={formData.content}
                onChange={value => handleInputChange('content', value)}
                postType={formData.postType}
                maxLength={80}
              />
            ) : (
              <EditorWrapper style={{ flex: 1 }}>
                <ToastEditor
                  value={formData.content}
                  onChange={value => handleInputChange('content', value)}
                  height="100%"
                  initialEditType="wysiwyg"
                  hideModeSwitch={true}
                  onImageUpload={handleImageUpload}
                />
              </EditorWrapper>
            )}
          </FormGroup>
        </Form>
      </Content>

      <CancelConfirmModal
        isOpen={showCancelModal}
        onContinue={handleContinueWriting}
        onCancel={handleConfirmCancel}
      />

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
