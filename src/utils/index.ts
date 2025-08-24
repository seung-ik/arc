import { BUSINESS_IMAGES } from '@/assets';

/**
 * 날짜를 보기 좋은 형태로 변환하는 함수
 * @param dateString - ISO 8601 형식의 날짜 문자열 (예: "2025-08-01T13:27:55.486Z")
 * @returns 포맷된 날짜 문자열 (예: "2025년 8월 1일")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // 한국 시간대로 변환
  const koreanDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = koreanDate.getFullYear();
  const month = koreanDate.getMonth() + 1;
  const day = koreanDate.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 날짜를 상대적 시간으로 변환하는 함수 (24시간 이내만)
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 상대적 시간 문자열 (24시간 이내만, 없으면 빈 문자열)
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else {
    return '';
  }
};

/**
 * 매치글 유효기간 계산 함수
 * @param createdDate - 생성된 날짜 문자열
 * @param validityPeriod - 유효기간 (일 단위)
 * @returns 유효기간 상태 문자열
 */
export const calculateValidityPeriod = (
  createdDate: string,
  validityPeriod: string
): string => {
  const created = new Date(createdDate);
  const now = new Date();

  const validityDays = parseInt(validityPeriod);
  const endDate = new Date(
    created.getTime() + validityDays * 24 * 60 * 60 * 1000
  );

  const timeDiff = endDate.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return '만료됨';
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (days > 0) {
    return `유효기간: ${days}일 남음`;
  } else if (hours > 0) {
    return `유효기간: ${hours}시간 남음`;
  } else {
    return '유효기간: 1시간 미만';
  }
};

// 폼 검증 함수들 export
export * from './validate';

/**
 * 카테고리명에 따른 비즈니스 이미지 반환
 * @param category 카테고리명 (영문 또는 한글)
 * @returns 해당 카테고리의 비즈니스 이미지
 */
export const getCategoryImg = (category: string) => {
  switch (category) {
    case 'tennis':
    case '테니스':
      return BUSINESS_IMAGES.EX_1;
    case 'badminton':
    case '배드민턴':
      return BUSINESS_IMAGES.EX_2;
    case 'table_tennis':
    case '탁구':
      return BUSINESS_IMAGES.EX_3;
    case 'billiards':
    case '당구':
      return BUSINESS_IMAGES.EX_4;
    case 'go':
    case '바둑':
      return BUSINESS_IMAGES.EX_5;
    case 'chess':
    case '체스':
      return BUSINESS_IMAGES.EX_6;
    case 'general':
    case '자유글':
      return BUSINESS_IMAGES.EX_8;
  }
  return BUSINESS_IMAGES.EX_8;
};
