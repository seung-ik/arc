'use client';

import { useRouter } from 'next/navigation';
import { formatDate, formatRelativeTime } from '@/utils';
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
  AuthorProfileImage,
  AuthorProfileInitials,
  AuthorTextInfo,
} from '@/styles/PostDetailStyles';

interface PostHeaderProps {
  title: string;
  authorId: number;
  authorName: string;
  date: string;
  postType: string;
  viewCount?: number;
  authorProfileImage?: string;
}

export default function PostHeader({
  title,
  authorId,
  authorName,
  date,
  postType,
  viewCount,
  authorProfileImage,
}: PostHeaderProps) {
  const router = useRouter();

  const handleAuthorClick = (authorId: number) => {
    router.push(`/profile/${authorId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PostHeaderStyled>
      <PostMeta>
        <AuthorInfo>
          {authorProfileImage ? (
            <AuthorProfileImage src={authorProfileImage} alt={authorName} />
          ) : (
            <AuthorProfileInitials>
              {getInitials(authorName)}
            </AuthorProfileInitials>
          )}
          <AuthorTextInfo>
            <AuthorName onClick={() => handleAuthorClick(authorId)}>
              {authorName}
            </AuthorName>
            <PostDate>
              {formatDate(date)}
              {formatRelativeTime(date) && ` (${formatRelativeTime(date)})`}
            </PostDate>
          </AuthorTextInfo>
        </AuthorInfo>
      </PostMeta>
      <PostTitleRow>
        <PostTitleContainer>
          <PostTypeBadge>{postType}</PostTypeBadge>
          <PostTitle>{title}</PostTitle>
        </PostTitleContainer>
        {viewCount && <ViewCount>조회 {viewCount}</ViewCount>}
      </PostTitleRow>
    </PostHeaderStyled>
  );
}
