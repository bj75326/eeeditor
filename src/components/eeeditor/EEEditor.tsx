import React, { CSSProperties, useState } from 'react';
import Editor, { PluginEditorProps } from '@draft-js-plugins/editor';
import { EditorState, convertToRaw } from 'draft-js';
import classNames from 'classnames';
import zhCN from './locale/zh_CN';

export type DirectionType = 'ltr' | 'rtl' | undefined;

export interface Locale {}

export interface EEEditorProps extends PluginEditorProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: Locale;
  direction?: DirectionType;
}

const EEEditor: React.FC<EEEditorProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    locale = zhCN,
    direction,
    editorState,
    onChange,
  } = props;

  const eeeditorCls = classNames(prefixCls, {}, className);

  //const eeeditorRef = useRef(null);

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
        //ref={eeeditorRef}
      />
    </div>
  );
};

export default EEEditor;
