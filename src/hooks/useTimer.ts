import { useState, useEffect } from 'react';

interface TimerResult {
  seconds: number;
  progress: number;
  color: string;
}

export const useTimer = (
  expiredTime: string,
  createdAt: string
): TimerResult => {
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState('#28a745');

  useEffect(() => {
    const calculateTimer = () => {
      const now = Date.now();
      const expiredTimeMs = new Date(expiredTime).getTime();
      const createdAtMs = new Date(createdAt).getTime();
      const remaining = expiredTimeMs - now;

      if (remaining <= 0) {
        setSeconds(0);
        setProgress(360);
        setColor('#dc3545');
        return;
      }

      const totalSeconds = Math.floor(remaining / 1000);

      // 진행률 계산: createdAt과 expiredTime의 차이를 기준으로 계산
      const totalDuration = Math.floor((expiredTimeMs - createdAtMs) / 1000); // 총 지속시간(초)
      const elapsedSeconds = totalDuration - totalSeconds;
      const newProgress = Math.min((elapsedSeconds / totalDuration) * 360, 360);

      // 색상 계산: total duration 기준으로 25%, 50%, 75% 구간별 변경
      let newColor = '#28a745'; // 초록색 (75% 이상 남음)
      const remainingPercentage = (totalSeconds / totalDuration) * 100;

      if (remainingPercentage <= 25) {
        // 25% 이하 남음
        newColor = '#dc3545'; // 빨간색
      } else if (remainingPercentage <= 50) {
        // 25-50% 남음
        newColor = '#ffc107'; // 노란색
      } else if (remainingPercentage <= 75) {
        // 50-75% 남음
        newColor = '#ffa500'; // 주황색
      }

      setSeconds(totalSeconds);
      setProgress(newProgress);
      setColor(newColor);
    };

    // 초기 계산
    calculateTimer();

    const interval = setInterval(calculateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiredTime, createdAt]);

  return { seconds, progress, color };
};
