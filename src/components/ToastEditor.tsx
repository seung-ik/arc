import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor.css';

// 동적 import로 SSR 이슈 방지
const Editor = dynamic(
  () => import('@toast-ui/react-editor').then(mod => mod.Editor),
  {
    ssr: false,
  }
);

export interface ToastEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  placeholder?: string;
  initialEditType?: 'markdown' | 'wysiwyg';
  toolbarItems?: string[][];
}

const DEFAULT_TOOLBAR: string[][] = [
  ['heading', 'bold', 'italic', 'strike'],
  ['hr', 'quote'],
  ['ul', 'ol', 'task', 'indent', 'outdent'],
  ['table', 'image', 'link'],
  ['code', 'codeblock'],
];

const ToastEditor: React.FC<ToastEditorProps> = ({
  value = '',
  onChange,
  height = '400px',
  placeholder = '내용을 입력하세요',
  initialEditType = 'wysiwyg',
  toolbarItems = DEFAULT_TOOLBAR,
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const editorInstance = editorRef.current.getInstance();
      if (editorInstance && editorInstance.getMarkdown() !== value) {
        editorInstance.setMarkdown(value);
      }
    }
  }, [value]);

  const handleChange = () => {
    if (editorRef.current && onChange) {
      const editorInstance = editorRef.current.getInstance();
      onChange(editorInstance.getMarkdown());
    }
  };

  return (
    <Editor
      ref={editorRef}
      initialValue={value}
      previewStyle="vertical"
      height={height}
      initialEditType={initialEditType}
      useCommandShortcut={true}
      placeholder={placeholder}
      toolbarItems={toolbarItems}
      onChange={handleChange}
    />
  );
};

export default ToastEditor;
