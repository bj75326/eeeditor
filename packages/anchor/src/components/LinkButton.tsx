import React, {
  CSSProperties,
  ReactNode,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import {
  EditorState,
  KeyCommand,
  EditorPlugin,
  ContentState,
  ContentBlock,
  DraftBlockType,
  SelectionState,
  PluginMethods,
} from '@eeeditor/editor';
import classNames from 'classnames';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import { Tooltip } from 'antd';
import { AnchorPluginStore, Languages, Locale, zhCN } from '..';
// todo
import EditorUtils from '@draft-js-plugins/utils';
import createLinkAtSelection from '../modifiers/createLinkAtSelection';
import linkInSelection from '../utils/linkInSelection';
import LinkEditPopover from './LinkEditPopover';

export const defaultLinkIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M26.24 16.373L17.1 7.23303C14.4386 4.57168 10.0651 4.6303 7.33143 7.36397C4.59776 10.0976 4.53913 14.4712 7.20049 17.1325L15.1358 25.0678"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M32.9027 23.0033L40.838 30.9386C43.4994 33.5999 43.4408 37.9734 40.7071 40.7071C37.9734 43.4408 33.5999 43.4994 30.9386 40.8381L21.7985 31.698"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M26.1091 26.1416C28.8427 23.4079 28.9014 19.0344 26.24 16.373"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M21.7985 21.7985C19.0649 24.5322 19.0062 28.9057 21.6676 31.5671"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export interface LinkButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  title?: {
    name?: string;
    shortcut?: string;
  };
  tipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  tipReverse?: boolean;
  children?: ReactNode;
  // shortcut 自定义
  keyCommand?: KeyCommand | false;
}

export interface LinkButtonExtraProps {
  // toolbar plugin 提供的 props
  getEditorState?: () => EditorState;
  setEditorState?: (editorState: EditorState) => void;
  getProps?: PluginMethods['getProps'];
  getEditorRef?: PluginMethods['getEditorRef'];
  addKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  removeKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  addKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  removeKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  // anchor plugin createAnchorPlugin 内添加的内置 props
  languages?: Languages;
  store?: AnchorPluginStore;
}

const LinkButton: React.FC<LinkButtonProps & LinkButtonExtraProps> = (
  props,
) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    title = {
      name: 'eeeditor.anchor.button.tip.name',
      shortcut: 'eeeditor.anchor.button.tip.shortcut',
    },
    tipProps,
    tipReverse,
    children = defaultLinkIcon,
    keyCommand,
    getEditorState,
    setEditorState,
    getProps,
    getEditorRef,
    addKeyBindingFn,
    removeKeyBindingFn,
    addKeyCommandHandler,
    removeKeyCommandHandler,
    languages,
    store,
  } = props;

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }

  const { removeLinkAtSelection } = EditorUtils;

  const preventBubblingUp = (event: MouseEvent): void => {
    event.preventDefault();
  };

  const handleBtnClick = (event: MouseEvent): void => {
    event.preventDefault();
    const editorState = getEditorState();

    if (linkButtonIsActive()) {
      setEditorState(removeLinkAtSelection(editorState));
      return;
    }

    // const editorRef = getEditorRef();
    // if (!editorRef) {
    //   return;
    // }

    // let editorRoot = editorRef.editor;
    // while (editorRoot.className.indexOf('DraftEditor-root') === -1) {
    //   editorRoot = editorRoot.parentNode as HTMLElement;
    // }
    // const position = getPopoverPosition(editorRoot);
    // store.updateItem('position', position);
    // store.updateItem('initText', '');
    // store.updateItem('initLink', '');
    store.updateItem('visible', true);
  };

  useEffect(() => {}, []);

  const checkButtonShouldDisabled = (): boolean => {
    if (!getEditorState) {
      return true;
    }
    const editorState: EditorState = getEditorState();
    const selection: SelectionState = editorState.getSelection();
    const currentBlock: ContentBlock = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const currentBlockType: DraftBlockType = currentBlock.getType();
    // 当 selection start block type 为 'atomic' 或者 'code-block' 时，
    // 当 selection startKey !== endKey 时，
    // disabled
    if (
      currentBlockType === 'atomic' ||
      currentBlockType === 'code-block' ||
      selection.getStartKey() !== selection.getEndKey()
    ) {
      return true;
    }
    return false;
  };

  const linkButtonIsActive = (): boolean => {
    if (!getEditorState) {
      return false;
    }
    const editorState: EditorState = getEditorState();
    const selection: SelectionState = editorState.getSelection();
    const contentState: ContentState = editorState.getCurrentContent();

    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    return linkInSelection(currentBlock, selection, contentState);
  };

  const btnClassName = classNames(`${prefixCls}-btn`, className, {
    [`${prefixCls}-btn-active`]: linkButtonIsActive(),
    [`${prefixCls}-btn-disabled`]: checkButtonShouldDisabled(),
  });

  const tipClassName = classNames(`${prefixCls}-tip`, {
    [`${prefixCls}-tip-reverse`]:
      tipReverse !== undefined
        ? tipReverse
        : tipProps && tipProps.placement.startsWith('top'),
  });

  const tipTitle: ReactNode =
    title && title.name ? (
      <span className={tipClassName}>
        <span className={`${prefixCls}-tip-name`}>
          {locale[title.name] || title.name}
        </span>
        {title.shortcut && (
          <span className={`${prefixCls}-tip-shortcut`}>
            {locale[title.shortcut] || title.shortcut}
          </span>
        )}
      </span>
    ) : (
      ''
    );

  return (
    <div className={`${prefixCls}-btn-wrapper`} onMouseDown={preventBubblingUp}>
      {checkButtonShouldDisabled() ? (
        <div className={btnClassName} style={style}>
          {children}
        </div>
      ) : (
        // <Tooltip
        //   title={tipTitle}
        //   overlayClassName={`${prefixCls}-tip-wrapper`}
        //   {...tipProps}
        // >
        //   <div className={btnClassName} style={style} onClick={handleBtnClick}>
        //     {children}
        //   </div>
        // </Tooltip>
        <div className={btnClassName} style={style} onClick={handleBtnClick}>
          {children}
        </div>
      )}
    </div>
  );
};

export default LinkButton;
