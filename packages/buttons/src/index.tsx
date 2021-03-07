import { ComponentType, CSSProperties, ReactNode } from 'react';
import { EditorState } from 'draft-js';
import createBlockStyleButton from './utils/createBlockStyleButton';
import createInlineStyleButton from './utils/createInlineStyleButton';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import shouldButtonDisabled from './utils/disableStrategy';
import HeadlineOneButton from './components/HeadlineOneButton';
import HeadlineTwoButton from './components/HeadlineTwoButton';
import HeadlineThreeButton from './components/HeadlineThreeButton';
import HeadlineFourButton from './components/HeadlineFourButton';
import HeadlineFiveButton from './components/HeadlineFiveButton';
import HeadlineSixButton from './components/HeadlineSixButton';
import BoldButton from './components/BoldButton';
import CodeButton from './components/CodeButton';
import UnderlineButton from './components/UnderlineButton';
import ItalicButton from './components/ItalicButton';
import enUS from './locale/en_US';
import zhCN from './locale/zh_CN';

export interface Locale {
  'eeeditor.button.h1.tip.name': string;
  'eeeditor.button.h1.tip.shortcut': string;
  'eeeditor.button.h2.tip.name': string;
  'eeeditor.button.h2.tip.shortcut': string;
  'eeeditor.button.h3.tip.name': string;
  'eeeditor.button.h3.tip.shortcut': string;
  'eeeditor.button.h4.tip.name': string;
  'eeeditor.button.h4.tip.shortcut': string;
  'eeeditor.button.h5.tip.name': string;
  'eeeditor.button.h5.tip.shortcut': string;
  'eeeditor.button.h6.tip.name': string;
  'eeeditor.button.h6.tip.shortcut': string;
  'eeeditor.button.bold.tip.name': string;
  'eeeditor.button.bold.tip.shortcut': string;
  'eeeditor.button.underline.tip.name': string;
  'eeeditor.button.code.tip.name': string;
  'eeeditor.button.italic.tip.name': string;
  'eeeditor.button.italic.tip.shortcut': string;
}

// 在 disableStrategy 时使用
export type EEEditorButtonType =
  | 'header'
  | 'bold'
  | 'italic'
  | 'code'
  | 'underline';

export interface EEEditorButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: Locale;
  title?: {
    name?: string;
    shortcut?: string;
  };
  // align?: TooltipPropsWithTitle['align'];
  // placement?: TooltipPropsWithTitle['placement'];
  tipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  icon?: ReactNode;
}

export interface EEEditorStyleButtonProps extends EEEditorButtonProps {
  // toolbar plugin 提供的 props
  getEditorState(): EditorState;
  setEditorState(editorState: EditorState): void;
  // 使用 static toolbar 时，selector button 提供的 props
  setSelectorBtnActive?: (active: boolean, optionKey: number) => void;
  setSelectorBtnDisabled?: (disabled: boolean, optionKey: number) => void;
  optionKey?: number;
}

export type EEEditorStyleButtonType = ComponentType<EEEditorStyleButtonProps>;

export {
  createBlockStyleButton,
  createInlineStyleButton,
  shouldButtonDisabled,
  zhCN,
  enUS,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  HeadlineFourButton,
  HeadlineFiveButton,
  HeadlineSixButton,
  BoldButton,
  CodeButton,
  UnderlineButton,
  ItalicButton,
};
