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
