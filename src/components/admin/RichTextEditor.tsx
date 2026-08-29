'use client';

import React, { useRef, useState } from 'react';
import MediaPickerModal from './MediaPickerModal';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  minHeight = '200px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  function executeCommand(command: string, value: string | undefined = undefined) {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function handleInsertImage(url: string, altText: string = '') {
    if (editorRef.current) {
      editorRef.current.focus();
      const imgHtml = `<img src="${url}" alt="${altText}" style="max-width: 100%; height: auto; margin: 15px 0; border-radius: 4px;" />`;
      document.execCommand('insertHTML', false, imgHtml);
      onChange(editorRef.current.innerHTML);
    }
  }

  function handleAddLink() {
    const url = prompt('Enter the link URL (e.g. https://... or /contact):');
    if (url) {
      executeCommand('createLink', url);
    }
  }

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '6px',
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      {/* WordPress-Style Formatting Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #ddd',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          style={toolbarBtnStyle}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          style={toolbarBtnStyle}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          style={toolbarBtnStyle}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>

        <div style={toolbarDividerStyle} />

        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          style={toolbarBtnStyle}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          style={toolbarBtnStyle}
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<p>')}
          style={toolbarBtnStyle}
          title="Paragraph"
        >
          P
        </button>

        <div style={toolbarDividerStyle} />

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          style={toolbarBtnStyle}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          style={toolbarBtnStyle}
          title="Numbered List"
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          style={toolbarBtnStyle}
          title="Quote Block"
        >
          &ldquo; Quote
        </button>

        <div style={toolbarDividerStyle} />

        <button
          type="button"
          onClick={handleAddLink}
          style={toolbarBtnStyle}
          title="Insert Link"
        >
          🔗 Link
        </button>

        <button
          type="button"
          onClick={() => setMediaPickerOpen(true)}
          style={{
            ...toolbarBtnStyle,
            backgroundColor: 'var(--ast-global-color-0)',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
          }}
          title="Insert Media Image"
        >
          🖼 Insert Image
        </button>

        <div style={toolbarDividerStyle} />

        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          style={toolbarBtnStyle}
          title="Clear Formatting"
        >
          ✕ Clear
        </button>
      </div>

      {/* Visual Editable Canvas */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{
          minHeight,
          padding: '16px 20px',
          outline: 'none',
          fontSize: '14px',
          lineHeight: '1.7em',
          color: '#333',
        }}
        data-placeholder={placeholder}
      />

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelectImage={handleInsertImage}
      />
    </div>
  );
}

const toolbarBtnStyle: React.CSSProperties = {
  padding: '5px 10px',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const toolbarDividerStyle: React.CSSProperties = {
  width: '1px',
  height: '18px',
  backgroundColor: '#ddd',
  margin: '0 4px',
};
