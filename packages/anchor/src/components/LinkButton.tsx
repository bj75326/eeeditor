import React, { CSSProperties, ReactNode, MouseEvent } from 'react';
import {
  EditorState,
  KeyCommand,
  EditorPlugin,
  ContentBlock,
  DraftBlockType,
  SelectionState,
} from '@eeeditor/editor';
import classNames from 'classnames';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import { Locale } from '..';
import zhCN from '../locale/zh_CN';

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
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32.9027 23.0033L40.838 30.9386C43.4994 33.5999 43.4408 37.9734 40.7071 40.7071C37.9734 43.4408 33.5999 43.4994 30.9386 40.8381L21.7985 31.698"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26.1091 26.1416C28.8427 23.4079 28.9014 19.0344 26.24 16.373"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.7985 21.7985C19.0649 24.5322 19.0062 28.9057 21.6676 31.5671"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface LinkButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: Locale;
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
  addKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  removeKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  addKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  removeKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
}

const LinkButton: React.FC<LinkButtonProps & LinkButtonExtraProps> = (
  props,
) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    locale = zhCN,
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
  } = props;

  const preventBubblingUp = (event: MouseEvent): void => {
    event.preventDefault();
  };

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
    // 当 selection collapsed === true 时，
    // disabled
    if (
      currentBlockType === 'atomic' ||
      currentBlockType === 'code-block' ||
      selection.isCollapsed()
    ) {
      return true;
    }
    return false;
  };

  const btnClassName = classNames(`${prefixCls}-btn`, className, {
    [`${prefixCls}-btn-disabled`]: checkButtonShouldDisabled(),
  });

  return (
    <div className={`${prefixCls}-btn-wrapper`} onMouseDown={preventBubblingUp}>
      {checkButtonShouldDisabled() ? (
        <div className={btnClassName} style={style}>
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default LinkButton;
