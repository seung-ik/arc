import { PostFormData } from '@/types/post';

// 일반 포스트 검증
export const validateGeneralPost = (formData: PostFormData): boolean => {
  if (!formData.title.trim()) {
    alert('제목을 입력해주세요.');
    return false;
  }
  if (!formData.content.trim() || formData.content.trim() === '<p><br></p>') {
    alert('내용을 입력해주세요.');
    return false;
  }
  if (!formData.category) {
    alert('카테고리를 선택해주세요.');
    return false;
  }
  return true;
};

// 매치 포스트 검증
export const validateMatchPost = (formData: PostFormData): boolean => {
  if (!formData.title.trim()) {
    alert('제목을 입력해주세요.');
    return false;
  }
  if (!formData.content.trim()) {
    alert('내용을 입력해주세요.');
    return false;
  }
  if (!formData.category) {
    alert('카테고리를 선택해주세요.');
    return false;
  }
  if (formData.matchLocation && !formData.matchLocation.trim()) {
    alert('매치 장소를 입력해주세요.');
    return false;
  }
  if (!formData.myElo) {
    alert('내 ELO 점수를 입력해주세요.');
    return false;
  }
  if (!formData.preferredElo) {
    alert('선호하는 ELO 범위를 선택해주세요.');
    return false;
  }
  if (!formData.participantCount) {
    alert('참가 인원을 선택해주세요.');
    return false;
  }
  return true;
};

// 멘토 포스트 검증
export const validateMentorPost = (formData: PostFormData): boolean => {
  if (!formData.title.trim()) {
    alert('제목을 입력해주세요.');
    return false;
  }
  if (!formData.content.trim()) {
    alert('내용을 입력해주세요.');
    return false;
  }
  if (!formData.category) {
    alert('카테고리를 선택해주세요.');
    return false;
  }
  if (!formData.elo) {
    alert('ELO 점수를 입력해주세요.');
    return false;
  }
  if (formData.location && !formData.location.trim()) {
    alert('지역을 입력해주세요.');
    return false;
  }
  if (!formData.tokenReward) {
    alert('토큰 보상을 입력해주세요.');
    return false;
  }
  return true;
};
