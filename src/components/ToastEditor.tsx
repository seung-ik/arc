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
  hideModeSwitch?: boolean;
}

const DEFAULT_TOOLBAR: string[][] = [
  ['heading', 'bold', 'italic', 'strike'],
  ['image', 'link'],
];

const ToastEditor: React.FC<ToastEditorProps> = ({
  value = '',
  onChange,
  height = '400px',
  // placeholder = '내용을 입력하세요',
  initialEditType = 'wysiwyg',
  toolbarItems = DEFAULT_TOOLBAR,
  hideModeSwitch = false,
}) => {
  const editorRef = useRef<any>(null);
  console.log(editorRef?.current?.getInstance().getHTML());

  // 초기값 및 외부 값 변경에 따라 내용 설정
  useEffect(() => {
    if (!editorRef.current || value === undefined) return;

    const editorInstance = editorRef.current.getInstance();
    const currentHTML = editorInstance.getHTML();

    // 처음 들어가면 내용 다 지우기
    if (value === '' && currentHTML !== '<p><br></p>') {
      editorInstance.setHTML('<p><br></p>');
    } else if (value !== '' && currentHTML !== value) {
      editorInstance.setHTML(value);
    }
  }, [value]);

  // 컴포넌트가 처음 마운트될 때 내용 초기화
  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setHTML('<p><br></p>');
    }
  }, []);

  // 에디터에서 입력이 변경되면 외부로 전달
  const handleChange = () => {
    if (editorRef.current && onChange) {
      const editorInstance = editorRef.current.getInstance();
      const html = editorInstance.getHTML();
      if (html !== value) {
        onChange(html);
      }
    }
  };

  return (
    <Editor
      ref={editorRef}
      initialValue="<p><br></p>" // 초기 렌더링 시 빈 문단 하나만 넣음
      previewStyle="vertical"
      height={height}
      initialEditType={initialEditType}
      useCommandShortcut={true}
      // placeholder={placeholder}
      toolbarItems={toolbarItems}
      onChange={handleChange}
      hideModeSwitch={hideModeSwitch}
    />
  );
};

export default ToastEditor;
