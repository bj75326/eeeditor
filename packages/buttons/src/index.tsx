import { CSSProperties, ReactNode, KeyboardEvent } from 'react';
import { EditorState, EditorPlugin, EditorProps } from '@eeeditor/editor';
import createToggleBlockTypeButton from './utils/createToggleBlockTypeButton';
import createToggleInlineStyleButton from './utils/createToggleInlineStyleButton';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import shouldButtonDisabled from './utils/disableStrategy';
import { defaultHeadIcon } from './assets/extraIcons';
import HeadlineOneButton, {
  defaultHeadlineOneIcon,
} from './components/HeadlineOneButton';
import HeadlineTwoButton, {
  defaultHeadlineTwoIcon,
} from './components/HeadlineTwoButton';
import HeadlineThreeButton, {
  defaultHeadlineThreeIcon,
} from './components/HeadlineThreeButton';
import HeadlineFourButton, {
  defaultHeadlineFourIcon,
} from './components/HeadlineFourButton';
import HeadlineFiveButton, {
  defaultHeadlineFiveIcon,
} from './components/HeadlineFiveButton';
import HeadlineSixButton, {
  defaultHeadlineSixIcon,
} from './components/HeadlineSixButton';
import BoldButton, { defaultBoldIcon } from './components/BoldButton';
import CodeButton, { defaultCodeIcon } from './components/CodeButton';
import UnderlineButton, {
  defaultUnderlineIcon,
} from './components/UnderlineButton';
import ItalicButton, { defaultItalicIcon } from './components/ItalicButton';
import OrderedListButton, {
  defaultOrderedListIcon,
} from './components/OrderedListButton';
import UnorderedListButton, {
  defaultUnorderedListIcon,
} from './components/UnorderedListButton';
import BlockquoteButton, {
  defaultBlockquoteIcon,
} from './components/BlockquoteButton';
import AlignCenterButton, {
  defaultAlignCenterIcon,
} from './components/AlignCenterButton';
import AlignJustifyButton, {
  defaultAlignJustifyIcon,
} from './components/AlignJustifyButton';
import AlignLeftButton, {
  defaultAlignLeftIcon,
} from './components/AlignLeftButton';
import AlignRightButton, {
  defaultAlignRightIcon,
} from './components/AlignRightButton';
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
  'eeeditor.button.underline.tip.shortcut': string;
  'eeeditor.button.code.tip.name': string;
  'eeeditor.button.italic.tip.name': string;
  'eeeditor.button.italic.tip.shortcut': string;
  'eeeditor.button.ol.tip.name': string;
  'eeeditor.button.ol.tip.shortcut': string;
  'eeeditor.button.ul.tip.name': string;
  'eeeditor.button.ul.tip.shortcut': string;
  'eeeditor.button.blockquote.tip.name': string;
  'eeeditor.button.blockquote.tip.shortcut': string;
}

// 在 disableStrategy 时使用
export type EEEditorButtonType =
  | 'header'
  | 'ordered-list-item'
  | 'unordered-list-item'
  | 'blockquote'
  | 'bold'
  | 'italic'
  | 'code'
  | 'underline'
  | 'align';

export interface KeyCommand {
  keyCode: KeyboardEvent['keyCode'];
  isShiftKeyCommand?: boolean; // e.shiftKey
  isCtrlKeyCommand?: boolean; // !!e.ctrlKey && !e.altKey
  isOptionKeyCommand?: boolean; // isOSX && e.altKey
  hasCommandModifier?: boolean; // isOSX ? !!e.metaKey && !e.altKey : !!e.ctrlKey && !e.altKey
}

export interface EEEditorButtonProps {
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
  syntax?: string | false;
}

export interface EEEditorStyleButtonProps extends EEEditorButtonProps {
  // toolbar plugin 提供的 props
  getEditorState?: () => EditorState;
  setEditorState?: (editorState: EditorState) => void;
  getProps?: () => EditorProps;
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

export type EEEditorStyleButtonType = React.FC<EEEditorStyleButtonProps>;

export {
  createToggleBlockTypeButton,
  createToggleInlineStyleButton,
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
  OrderedListButton,
  UnorderedListButton,
  BlockquoteButton,
  AlignCenterButton,
  AlignJustifyButton,
  AlignLeftButton,
  AlignRightButton,
  defaultHeadIcon,
  defaultHeadlineOneIcon,
  defaultHeadlineTwoIcon,
  defaultHeadlineThreeIcon,
  defaultHeadlineFourIcon,
  defaultHeadlineFiveIcon,
  defaultHeadlineSixIcon,
  defaultBoldIcon,
  defaultCodeIcon,
  defaultUnderlineIcon,
  defaultItalicIcon,
  defaultOrderedListIcon,
  defaultUnorderedListIcon,
  defaultBlockquoteIcon,
  defaultAlignCenterIcon,
  defaultAlignJustifyIcon,
  defaultAlignLeftIcon,
  defaultAlignRightIcon,
};
