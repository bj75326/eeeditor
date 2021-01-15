import React, { CSSProperties } from 'react';
import Editor, { PluginEditorProps } from '@draft-js-plugins/editor';
import { EditorState, convertToRaw, ContentBlock } from 'draft-js';
import classNames from 'classnames';
import zhCN from './locale/zh_CN';

import './style';

export interface Locale {}

export interface EEEditorProps extends PluginEditorProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: Locale;
}

const eeeBlockStyleFn = (contentBlock: ContentBlock): string => {
  const type = contentBlock.getType();
  if (type === 'unstyled' || type === 'paragraph') {
    return 'paragraph';
  }
  return '';
};

const EEEditor: React.FC<EEEditorProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    locale = zhCN,
    editorState,
    onChange,
    blockStyleFn,
    ...restProps
  } = props;

  const eeeditorCls = classNames(prefixCls, {}, className);

  const handleChange = (editorState: EditorState) => {
    onChange(editorState);
  };

  return (
    <div
      className={eeeditorCls}
      style={style}
      onBlur={() => {
        console.log('editor wrapper blur');
      }}
      onClick={() => {
        console.log('editor wrapper click');
      }}
      onMouseDown={() => {
        console.log('editor wrapper mousedown');
      }}
      onMouseUp={() => {
        console.log('editor wrapper mouseup');
      }}
    >
      <Editor
        editorState={editorState}
        onChange={handleChange}
        blockStyleFn={blockStyleFn || eeeBlockStyleFn}
        {...restProps}
      />
    </div>
  );
};

export default EEEditor;
