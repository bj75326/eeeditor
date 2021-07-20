import React, {
  CSSProperties,
  useEffect,
  useRef,
  forwardRef,
  createContext,
} from 'react';
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
  EditorProps,
} from '.';
import classNames from 'classnames';
import createFocusPlugin, { BlockFocusDecoratorProps } from './built-in/focus';
import createDefaultPlugin from './built-in/default';
import { ConfigProvider } from 'antd';
import { DirectionType } from 'antd/lib/config-provider';
import { Locale } from 'antd/lib/locale-provider';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';

const { decorator: focusDecorator, ...focusPlugin } = createFocusPlugin();
const defaultPlugin = createDefaultPlugin();

export { focusDecorator, BlockFocusDecoratorProps };

export interface EEEditorProps extends PluginEditorProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: SupportedLanguage;
}

export interface EEEditorContextProps {
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  textDirectionality: 'LTR' | 'RTL' | 'NEUTRAL';
  locale: SupportedLanguage;
}

const defaultEEEditorContextProps: EEEditorContextProps = {
  getPrefixCls: () => 'eee',
  textDirectionality: 'LTR',
  locale: 'zh_CN',
};

export const EEEditorContext = createContext<EEEditorContextProps>(
  defaultEEEditorContextProps,
);

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
  STRIKETHROUGH: {
    textDecoration: 'line-through',
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

const PluginEditor: React.FC<PluginEditorProps> = forwardRef((props, ref) => (
  <Editor {...props} ref={ref} />
));

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
      [`${prefixCls}-rtl`]: restProps.textDirectionality === 'RTL',
    },
    className,
  );

  // antd 组件的 Context 设置
  let antdDirection: DirectionType;
  let antdLocale: Locale;

  if (restProps.textDirectionality === 'RTL') {
    antdDirection = 'rtl';
  } else {
    antdDirection = 'ltr';
  }

  switch (locale) {
    case 'zh_CN':
      antdLocale = zhCN;
      break;
    case 'en_US':
      antdLocale = enUS;
      break;
    default:
      antdLocale = zhCN;
  }

  // eeeditor 的 Context 设置
  const eeeditorContextProps: EEEditorContextProps = {
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
    },
    textDirectionality: restProps.textDirectionality || 'LTR',
    locale: locale,
  };

  useEffect(() => {
    console.log('EEEditor componentDidUpdate!!');
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
    <EEEditorContext.Provider value={eeeditorContextProps}>
      <ConfigProvider direction={antdDirection} locale={antdLocale}>
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
            prefixCls={prefixCls}
            locale={locale}
            {...restProps}
          />
          {suffixes.map((SuffixComponent, index) => (
            <SuffixComponent key={index} />
          ))}
        </div>
      </ConfigProvider>
    </EEEditorContext.Provider>
  );
};

export default EEEditor;
