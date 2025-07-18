import styled from 'styled-components';

// 기본 컨테이너 스타일
export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
`;

export const Content = styled.div`
  flex: 1;
  width: 100%;
  padding: ${props => props.theme.spacing.md};
`;

// 게시글 헤더 스타일
export const PostHeader = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const PostTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  line-height: 1.4;
`;

export const PostTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const PostTitleContainer = styled.div`
  flex: 1;
`;

export const ViewCount = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  flex-shrink: 0;
  margin-left: ${props => props.theme.spacing.md};
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

export const AuthorName = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

export const PostDate = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
`;

// 배지 스타일
export const PostTypeBadge = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

export const CategoryBadge = styled.span`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

// 게시글 내용 스타일
export const PostContent = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.base};
  line-height: 1.8;
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.xl};
  white-space: pre-wrap;
  word-break: break-word;
`;

// 액션 버튼 스타일
export const PostActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
`;

export const ActionButton = styled.button<{
  $isActive: boolean;
  $variant: 'like' | 'dislike';
}>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  background: ${props =>
    props.$isActive
      ? props.$variant === 'like'
        ? '#fdf2f2'
        : '#f8f9fa'
      : 'white'};
  border: 1px solid
    ${props =>
      props.$isActive
        ? props.$variant === 'like'
          ? '#e74c3c'
          : '#6c757d'
        : props.theme.colors.border};
  color: ${props =>
    props.$isActive
      ? props.$variant === 'like'
        ? '#e74c3c'
        : '#6c757d'
      : props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s;
  min-width: 80px;
  justify-content: center;

  &:hover {
    background-color: ${props =>
      props.$isActive
        ? props.$variant === 'like'
          ? '#fdf2f2'
          : '#f8f9fa'
        : '#f8f9fa'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonText = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

export const ButtonCount = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textLightGray};
`;

// 댓글 섹션 스타일
export const CommentsSection = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`;

export const CommentsHeader = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const CommentForm = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  position: relative;
`;

export const CommentTextarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  padding-right: 80px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textBlack};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textGray};
  }
`;

export const CommentSubmitButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textWhite};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 50px;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

export const CommentItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: white;
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
`;

export const CommentAuthor = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

export const CommentDate = styled.span`
  color: ${props => props.theme.colors.textGray};
`;

export const CommentActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

export const CommentLikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  transition: color 0.2s;

  &:hover {
    color: #e74c3c;
  }

  &.liked {
    color: #e74c3c;
  }
`;

export const ReplyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

export const CommentContent = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.base};
  line-height: 1.6;
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

// 답글 스타일
export const ReplyForm = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
  position: relative;
`;

export const ReplyTextarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  padding-right: 120px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  background-color: white;
  color: ${props => props.theme.colors.textBlack};
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  line-height: 1.4;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textGray};
  }
`;

export const ReplyCancelButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: 60px;
  background-color: ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textGray};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.textGray};
    color: white;
  }
`;

export const ReplySubmitButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.xs};
  right: ${props => props.theme.spacing.xs};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textWhite};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

export const ToggleRepliesButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.primary};
  margin-top: ${props => props.theme.spacing.sm};
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primaryHover};
  }
`;

export const RepliesContainer = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  padding-left: ${props => props.theme.spacing.md};
  border-left: 2px solid ${props => props.theme.colors.border};
`;

export const ReplyItem = styled.div`
  margin-bottom: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

export const ReplyContent = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  line-height: 1.5;
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

export const ReplyFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ReplyMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
`;

export const ReplyDate = styled.span`
  color: ${props => props.theme.colors.textGray};
`;

export const ReplyAuthor = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

// 관리 섹션 스타일 (MyPostDetail용)
export const ManagementSection = styled.div`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const ManagementTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

export const ManagementButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

export const ManagementButton = styled.button<{
  $variant: 'edit' | 'delete' | 'profile';
}>`
  background-color: ${props => {
    switch (props.$variant) {
      case 'edit':
        return props.theme.colors.primary;
      case 'delete':
        return '#dc3545';
      case 'profile':
        return props.theme.colors.secondary;
      default:
        return props.theme.colors.primary;
    }
  }};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => {
      switch (props.$variant) {
        case 'edit':
          return props.theme.colors.primaryHover;
        case 'delete':
          return '#c82333';
        case 'profile':
          return props.theme.colors.secondaryHover;
        default:
          return props.theme.colors.primaryHover;
      }
    }};
  }
`;

// 매치 전용 스타일
export const MatchInfoSection = styled.div`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const MatchInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const MatchInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

export const MatchInfoLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

export const MatchInfoValue = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.textBlack};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
`;

export const EloValue = styled(MatchInfoValue)`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

export const ValidityPeriod = styled.div`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const JoinButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

// 멘토 전용 스타일
export const MentorInfoSection = styled.div`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const MentorInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const MentorInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

export const MentorInfoLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

export const MentorInfoValue = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.textBlack};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
`;

export const PriceValue = styled(MentorInfoValue)`
  color: ${props => props.theme.colors.success};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;
