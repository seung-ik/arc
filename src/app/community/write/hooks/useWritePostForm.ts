import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useCreatePostMutation } from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';
import { getCategoryPath } from '@/utils/categoryPath';

interface WritePostFormData {
  title: string;
  content: string;
  postType: string;
  category: string;
  sport: string;
  customSport: string;
  elo: string;
  location: string;
  tokenReward: string;
  matchLocation: string;
  myElo: string;
  preferredElo: string;
  validityPeriod: string;
}

export function useWritePostForm() {
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

  const [formData, setFormData] = useState<WritePostFormData>({
    title: '',
    content: '',
    postType: '일반',
    category: '',
    sport: '',
    customSport: '',
    elo: '',
    location: '',
    tokenReward: '',
    matchLocation: '',
    myElo: '',
    preferredElo: '',
    validityPeriod: '',
  });

  const [showCancelModal, setShowCancelModal] = useState(false);

  // defaultCategory가 변경될 때 formData.category 업데이트
  useEffect(() => {
    if (defaultCategory && !formData.category) {
      setFormData(prev => ({
        ...prev,
        category: defaultCategory,
      }));
    }
  }, [defaultCategory, formData.category]);

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

  return {
    formData,
    categories,
    showCancelModal,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleConfirmCancel,
    handleContinueWriting,
  };
}
