import React from 'react';

interface HtmlContentProps {
  content: string;
  className?: string;
}

export default function HtmlContent({ content, className }: HtmlContentProps) {
  // HTML 태그를 안전하게 처리
  const sanitizedContent = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
