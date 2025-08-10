'use client';

import styled from 'styled-components';

const GuideContainer = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border: 1px solid #2196f3;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const GuideTitle = styled.h3`
  color: #2196f3;
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
`;

const GuideDescription = styled.p`
  color: #666;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
`;

export default function MentorRequestGuide() {
  return (
    <GuideContainer>
      <GuideTitle>📚 멘토링 요청 안내</GuideTitle>
      <GuideDescription>
        멘토링을 받고 싶은 종목, 희망하는 멘토의 실력 수준, 지역, 보상 토큰 등을
        상세히 작성해주세요. 멘토가 요청을 보고 연락을 드릴 예정입니다.
      </GuideDescription>
    </GuideContainer>
  );
}
