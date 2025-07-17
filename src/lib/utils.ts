// 매치 글의 유효기간을 계산하는 함수
export const calculateValidityPeriod = (createdDate: string, validityPeriod: string): string => {
  const created = new Date(createdDate);
  const now = new Date();

  // 유효기간을 일 단위로 계산
  const validityDays = parseInt(validityPeriod);
  const endDate = new Date(created.getTime() + validityDays * 24 * 60 * 60 * 1000);

  // 현재 시간과 종료 시간의 차이 계산
  const timeDiff = endDate.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return '만료됨';
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `유효기간: ${days}일 남음`;
  } else if (hours > 0) {
    return `유효기간: ${hours}시간 남음`;
  } else {
    return '유효기간: 1시간 미만';
  }
};

// 매치 글인지 확인하는 함수
export const isMatchPost = (postType: string): boolean => {
  return postType === '매치';
};
