import { CSSProperties, ReactNode } from 'react';
import { EditorState, EditorPlugin, PluginMethods } from '@eeeditor/editor';
import createToggleBlockTypeButton from './utils/createToggleBlockTypeButton';
import createToggleInlineStyleButton from './utils/createToggleInlineStyleButton';
import createSetBlockDataButton from './utils/createSetBlockDataButton';
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
import { Languages } from './locale';

export * from './locale';

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
  | 'align'
  | string;

export interface EEEditorButtonProps<K, S> {
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
  keyCommand?: K;
  syntax?: S;
}

export interface EEEditorExtraButtonProps {
  // toolbar plugin 提供的 props
  getEditorState?: () => EditorState;
  setEditorState?: (editorState: EditorState) => void;
  getProps?: PluginMethods['getProps'];
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

export type EEEditorStyleButtonType<K, S> = React.FC<EEEditorButtonProps<K, S>>;

export {
  createToggleBlockTypeButton,
  createToggleInlineStyleButton,
  createSetBlockDataButton,
  shouldButtonDisabled,
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
