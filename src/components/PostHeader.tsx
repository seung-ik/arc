'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import {
  PostHeader as PostHeaderStyled,
  PostTitle,
  PostTitleRow,
  PostTitleContainer,
  ViewCount,
  PostMeta,
  AuthorInfo,
  AuthorName,
  PostDate,
  PostTypeBadge,
} from '@/styles/PostDetailStyles';

interface PostHeaderProps {
  title: string;
  authorId: string;
  authorName: string;
  date: string;
  postType: string;
  viewCount: number;
}

export default function PostHeader({
  title,
  authorId,
  authorName,
  date,
  postType,
  viewCount,
}: PostHeaderProps) {
  const router = useRouter();

  const handleAuthorClick = (authorId: string) => {
    router.push(`/profile/${authorId}`);
  };

  return (
    <PostHeaderStyled>
      <PostTitleRow>
        <PostTitleContainer>
          <PostTitle>{title}</PostTitle>
        </PostTitleContainer>
        <ViewCount>조회 {viewCount}</ViewCount>
      </PostTitleRow>
      <PostMeta>
        <AuthorInfo>
          <AuthorName onClick={() => handleAuthorClick(authorId)}>{authorName}</AuthorName>
          <PostDate>{date}</PostDate>
        </AuthorInfo>
        <PostTypeBadge>{postType}</PostTypeBadge>
      </PostMeta>
    </PostHeaderStyled>
  );
}
