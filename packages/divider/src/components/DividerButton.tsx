import React, { CSSProperties, ReactNode, MouseEvent } from 'react';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import {
  EditorState,
  EditorPlugin,
  ContentBlock,
  DraftBlockType,
} from '@eeeditor/editor';
import zhCN from '../locale/zh_CN';

export const defaultDividerIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 24H43"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M21 38H27"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M37 38H43"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M21 10H27"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M5 38H11"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M5 10H11"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M37 10H43"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export interface Locale {
  'eeeditor.divider.button.tip.name': string;
}

export interface DividerButtonProps {
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
  keyCommand?: string;
  syntax?: string;
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
  addBeforeInputHandler?: (
    beforeInputHandler: EditorPlugin['handleBeforeInput'],
  ) => void;
  removeBeforeInputHandler?: (
    beforeInputHandler: EditorPlugin['handleBeforeInput'],
  ) => void;
  // 使用 static toolbar 时，selector button 提供的 props
  setSelectorBtnActive?: (active: boolean, optionKey: number) => void;
  setSelectorBtnDisabled?: (disabled: boolean, optionKey: number) => void;
  optionKey?: number;
  setSelectorBtnIcon?: (icon?: ReactNode) => void;
}

const DividerButton: React.FC<DividerButtonProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    locale = zhCN,
    title = {
      name: 'eeeditor.divider.button.tip.name',
    },
    tipProps,
    tipReverse,
    children = defaultDividerIcon,
    keyCommand,
    syntax,
    getEditorState,
    setEditorState,
    addKeyCommandHandler,
    removeKeyCommandHandler,
    addKeyBindingFn,
    removeKeyBindingFn,
    addBeforeInputHandler,
    removeBeforeInputHandler,
    setSelectorBtnActive,
    setSelectorBtnDisabled,
    optionKey,
    setSelectorBtnIcon,
  } = props;

  const preventBubblingUp = (event: MouseEvent): void => {
    event.preventDefault();
  };

  const checkButtonShouldDisabled = (): boolean => {
    if (getEditorState) {
      return true;
    }
    const editorState: EditorState = getEditorState();
    const currentBlock: ContentBlock = editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getStartKey());
    const currentBlockType: DraftBlockType = currentBlock.getType();
    // 当 selection start block type 为 'atomic' 或者 'code-block' 时， disabled
    if (currentBlockType === 'atomic' || currentBlockType === 'code-block') {
      return true;
    }
    return false;
  };

  const btnClassName = classNames(`${prefixCls}-btn`, className, {
    [`${prefixCls}-btn-disabled`]: checkButtonShouldDisabled(),
  });

  const tipClassName = classNames(`${prefixCls}-tip`, {
    [`${prefixCls}-tip-reverse`]:
      tipReverse !== undefined
        ? tipReverse
        : tipProps.placement.startsWith('top'),
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
        <Tooltip title={tipTitle}></Tooltip>
      )}
    </div>
  );
};

export default DividerButton;
