import React, { CSSProperties, useRef } from 'react';
import Editor, { PluginEditorProps } from '@draft-js-plugins/editor';
import {
  EditorState,
  convertToRaw,
  ContentBlock,
  KeyBindingUtil,
  getDefaultKeyBinding,
} from 'draft-js';
import classNames from 'classnames';
import zhCN from './locale/zh_CN';

//test

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

  const eeeditorCls = classNames(
    prefixCls,
    {
      'eee-rtl': restProps.textDirectionality === 'RTL',
    },
    className,
  );

  const editorRef = useRef(null);

  const handleChange = (editorState: EditorState) => {
    onChange(editorState);
  };

  //test
  // const { hasCommandModifier } = KeyBindingUtil;
  // const myKeyBindingFn = (e): string | null => {
  //   if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
  //     return 'myeditor-save';
  //   }
  //   return getDefaultKeyBinding(e);
  // };
  // const myHandleKeyCommand = (command: string) => {
  //   console.log('get a command: ', command);
  //   if (command === 'myeditor-save') {
  //     // Perform a request to save your contents, set
  //     // a new `editorState`, etc.
  //     console.log('command handled in custom handleKeyCommand');
  //     return 'handled';
  //   }
  //   return 'not-handled';
  // };

  return (
    <div
      className={eeeditorCls}
      style={style}
      onBlur={() => {
        console.log('editor wrapper blur');
        editorRef.current.blur();
      }}
      onFocus={() => {
        console.log('editor wrapper focus');
      }}
      onClick={() => {
        console.log('editor wrapper click');
        editorRef.current.focus();
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
        // keyBindingFn={myKeyBindingFn}
        // handleKeyCommand={myHandleKeyCommand}
        // defaultKeyBindings={false}
        // defaultKeyCommands={false}
        ref={editorRef}
        {...restProps}
      />
    </div>
  );
};

export default EEEditor;
