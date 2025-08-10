'use client';

import { useState } from 'react';
import {
  ReplyForm as ReplyFormContainer,
  ReplyTextarea,
  ReplySubmitButton,
  ReplyCancelButton,
  ReplyFooter,
  ReplyCharacterCounter,
} from '@/styles/PostDetailStyles';

interface ReplyFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  placeholder?: string;
  maxLength?: number;
}

export default function ReplyForm({
  onSubmit,
  onCancel,
  placeholder = '내용을 입력해주세요.',
  maxLength = 200,
}: ReplyFormProps) {
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = () => {
    if (!replyContent.trim()) return;

    onSubmit(replyContent.trim());
    setReplyContent('');
  };

  const handleCancel = () => {
    setReplyContent('');
    onCancel();
  };

  return (
    <ReplyFormContainer>
      <ReplyTextarea
        value={replyContent}
        onChange={e => setReplyContent(e.target.value)}
        placeholder={placeholder}
      />
      <ReplyFooter>
        <ReplyCharacterCounter>
          {replyContent.length} / {maxLength}
        </ReplyCharacterCounter>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ReplyCancelButton onClick={handleCancel}>취소</ReplyCancelButton>
          <ReplySubmitButton
            onClick={handleSubmit}
            disabled={!replyContent.trim() || replyContent.length > maxLength}
          >
            등록
          </ReplySubmitButton>
        </div>
      </ReplyFooter>
    </ReplyFormContainer>
  );
}
