'use client';

import { useState } from 'react';
import {
  CommentForm as CommentFormContainer,
  CommentTextarea,
  CommentSubmitButton,
  CommentFooter,
  CharacterCounter,
} from '@/styles/PostDetailStyles';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function CommentForm({
  onSubmit,
  placeholder = '내용을 입력해주세요.',
  maxLength = 200,
}: CommentFormProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onSubmit(newComment.trim());
    setNewComment('');
  };

  return (
    <CommentFormContainer>
      <CommentTextarea
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        placeholder={placeholder}
      />
      <CommentFooter>
        <CharacterCounter>
          {newComment.length} / {maxLength}
        </CharacterCounter>
        <CommentSubmitButton
          onClick={handleSubmit}
          disabled={!newComment.trim() || newComment.length > maxLength}
        >
          등록
        </CommentSubmitButton>
      </CommentFooter>
    </CommentFormContainer>
  );
}
