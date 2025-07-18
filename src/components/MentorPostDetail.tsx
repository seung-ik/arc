'use client';

import styled from 'styled-components';
import { useState } from 'react';
import PostHeader from '@/components/PostHeader';
import { Container, Content, PostContent } from '@/styles/PostDetailStyles';
import { MentorPost } from '@/types/post';

interface MentorPostDetailProps {
  post: MentorPost;
}

const MentorInfoSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #e9ecef;
`;

const MentorInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const MentorInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MentorInfoLabel = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`;

const MentorInfoValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

const PriceValue = styled.span`
  font-size: 16px;
  color: #667eea;
  font-weight: 700;
`;

const ApplyButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default function MentorPostDetail({ post }: MentorPostDetailProps) {
  const [isApplied] = useState(false);

  const handleApply = () => {
    // TODO: 멘토링 신청 처리
    console.log('Apply for mentoring:', post.id);
  };

  return (
    <Container>
      <Content>
        <PostHeader
          title={post.title}
          authorId={post.authorId}
          authorName={post.authorName}
          date={post.date}
          postType={post.postType}
          viewCount={post.viewCount}
        />

        <MentorInfoSection>
          <MentorInfoGrid>
            {post.sport && (
              <MentorInfoItem>
                <MentorInfoLabel>종목</MentorInfoLabel>
                <MentorInfoValue>{post.sport}</MentorInfoValue>
              </MentorInfoItem>
            )}
            {post.elo && (
              <MentorInfoItem>
                <MentorInfoLabel>ELO 레벨</MentorInfoLabel>
                <MentorInfoValue>{post.elo}</MentorInfoValue>
              </MentorInfoItem>
            )}
            {post.location && (
              <MentorInfoItem>
                <MentorInfoLabel>지역</MentorInfoLabel>
                <MentorInfoValue>{post.location}</MentorInfoValue>
              </MentorInfoItem>
            )}
            {post.tokenReward && (
              <MentorInfoItem>
                <MentorInfoLabel>수업료</MentorInfoLabel>
                <PriceValue>{post.tokenReward} 토큰</PriceValue>
              </MentorInfoItem>
            )}
          </MentorInfoGrid>
        </MentorInfoSection>

        <PostContent>{post.content}</PostContent>

        <ApplyButton onClick={handleApply} disabled={isApplied}>
          {isApplied ? '신청 완료' : '멘토 신청하기'}
        </ApplyButton>
      </Content>
    </Container>
  );
}
