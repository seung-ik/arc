'use client';
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface NicknameModalProps {
  open: boolean;
  onSubmit: (nickname: string) => void;
}

const NicknameModal: React.FC<NicknameModalProps> = ({ open, onSubmit }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  // ESC 키로 닫히지 않도록 방지
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [open]);

  const handleSubmit = () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    onSubmit(nickname.trim());
  };

  return (
    <Modal isOpen={open} onClose={() => {}} title="닉네임 설정">
      <div style={{ padding: 24, minWidth: 320 }}>
        <input
          type="text"
          value={nickname}
          onChange={e => { setNickname(e.target.value); setError(''); }}
          placeholder="닉네임을 입력하세요"
          style={{ width: '100%', padding: 8, marginTop: 16, marginBottom: 8 }}
        />
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button style={{ width: '100%', padding: 10 }} onClick={handleSubmit}>
          확인
        </button>
      </div>
    </Modal>
  );
};

export default NicknameModal; 