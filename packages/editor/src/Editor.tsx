import React, { CSSProperties, useEffect, useRef } from 'react';
import Editor from 'draft-js-plugins-editor';
import { PluginEditorProps } from './';
import {
  EditorState,
  convertToRaw,
  ContentBlock,
  KeyBindingUtil,
  getDefaultKeyBinding,
} from './';
import defaultDecorators from './decorators';
import classNames from 'classnames';
import zhCN from './locale/zh_CN';

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

const PluginEditor: React.FC<PluginEditorProps> = (props) => (
  <Editor {...props} />
);

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

  const eeeditorCls = classNames(
    prefixCls,
    {
      'eee-rtl': restProps.textDirectionality === 'RTL',
    },
    className,
  );

  // const editorRef = useRef(null);

  const handleChange = (editorState: EditorState) => {
    onChange(editorState);
  };

  // test
  // useEffect(() => {
  //   console.log(
  //     'selection offset!!!!!!!!!:',
  //     editorState.getSelection().getStartOffset(),
  //   );
  // });

  return (
    <div
      className={eeeditorCls}
      style={style}
      onBlur={() => {
        console.log('editor wrapper blur');
        // editorRef.current.blur();
      }}
      onFocus={() => {
        console.log('editor wrapper focus');
      }}
      onClick={() => {
        console.log('editor wrapper click');
        // editorRef.current.focus();
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
        decorators={[defaultDecorators]}
        // ref={editorRef}
        {...restProps}
      />
    </div>
  );
};

export default EEEditor;
