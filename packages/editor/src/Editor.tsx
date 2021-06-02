import React, { CSSProperties, useEffect, useRef } from 'react';
import Editor from 'draft-js-plugins-editor';
import {
  EditorState,
  convertToRaw,
  ContentBlock,
  KeyBindingUtil,
  getDefaultKeyBinding,
  PluginEditorProps,
  RichUtils,
  SupportedLanguage,
} from '.';
import classNames from 'classnames';
import createFocusPlugin, { BlockFocusDecoratorProps } from './built-in/focus';
import createDefaultPlugin from './built-in/default';

const { decorator: focusDecorator, ...focusPlugin } = createFocusPlugin();
const defaultPlugin = createDefaultPlugin();

export { focusDecorator, BlockFocusDecoratorProps };

export interface EEEditorProps extends PluginEditorProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: SupportedLanguage;
}

const defaultBlockStyleFn = (contentBlock: ContentBlock): string => {
  const type = contentBlock.getType();
  switch (type) {
    case 'unstyled':
    case 'paragraph':
      return 'paragraph';
    case 'unordered-list-item':
      return 'unordered-list-item';
    case 'ordered-list-item':
      return 'ordered-list-item';
    case 'blockquote':
      return 'blockquote';
    case 'header-one':
      return 'header-one';
    case 'header-two':
      return 'header-two';
    case 'header-three':
      return 'header-three';
    case 'header-four':
      return 'header-four';
    case 'header-five':
      return 'header-five';
    case 'header-six':
      return 'header-six';
    case 'code-block':
      return 'code-block';
    default:
      return '';
  }
};

const defaultCustomStyleMap: PluginEditorProps['customStyleMap'] = {
  CODE: {
    display: 'inline',
    fontSize: '85%',
    margin: '0 .2em',
    padding: '.2em .4em .1em',
    border: '1px solid hsla(0,0%,39.2%,.2)',
    borderRadius: '3px',
    backgroundColor: 'hsla(0,0%,58.8%,.1)',
    fontFamily:
      'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',
  },
};

const defaultOnTab: PluginEditorProps['onTab'] = (
  e,
  { getEditorState, setEditorState },
) => {
  const editorState = getEditorState();
  setEditorState(RichUtils.onTab(e, editorState, 4));
  return false;
};

const PluginEditor: React.FC<PluginEditorProps> = (props) => (
  <Editor {...props} />
);

const EEEditor: React.FC<EEEditorProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    locale = 'zh_CN',
    editorState,
    onChange,
    blockStyleFn = defaultBlockStyleFn,
    customStyleMap = defaultCustomStyleMap,
    onTab = defaultOnTab,
    plugins = [],
    defaultKeyBindings = false,
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

  useEffect(() => {
    console.log('EEEditor componentDidUpdate!!');
    //console.log(editorState.getDecorator())
  });

  const handleChange = (editorState: EditorState) => {
    onChange(editorState);
  };

  let suffixes = [];

  const eeeditorPlugins = [focusPlugin, ...plugins, defaultPlugin].map(
    (plugin) => {
      const { suffix, ...others } = plugin;
      if (suffix) {
        suffixes.push(suffix);
      }
      return others;
    },
  );

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
      onSelect={() => {
        console.log('editor wrapper select');
      }}
    >
      <PluginEditor
        editorState={editorState}
        onChange={handleChange}
        blockStyleFn={blockStyleFn}
        customStyleMap={customStyleMap}
        onTab={onTab}
        plugins={eeeditorPlugins}
        // getDefaultKeyBinding 现在放到了 built-in defaultPlugin 中， defaultKeyBindings 默认为 false。
        defaultKeyBindings={defaultKeyBindings}
        // ref={editorRef}
        locale={locale}
        {...restProps}
      />
      {suffixes.map((SuffixComponent, index) => (
        <SuffixComponent key={index} />
      ))}
    </div>
  );
};

export default EEEditor;
