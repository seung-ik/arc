// 유효기간 계산 함수
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