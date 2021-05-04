import EEEditor, { focusDecorator, BlockFocusDecoratorProps } from './Editor';

export * from 'draft-js';

// draft-js-plugins-editor 使用 flow 做类型管理，所以在 @eeeditor/editor 这里转换成 ts 申明类型。
/* eslint-disable no-use-before-define */

/* eslint-disable no-undef */
// import { BlockNodeRecord } from 'draft-js/lib/BlockNodeRecord';
// import { ContentBlock, DraftInlineStyle } from 'draft-js';
// import { DraftDragType } from 'draft-js';
// import { EditorProps } from 'draft-js';
// import { DraftEditorCommand } from 'draft-js';
// import { CompositeDecorator, DraftDecorator } from 'draft-js';
// import { DraftHandleValue } from 'draft-js';
// import { BidiDirection } from 'fbjs/lib/UnicodeBidiDirection';
// import { DraftBlockRenderMap } from 'draft-js';
// import { EditorState, SelectionState } from 'draft-js';
import {
  ContentBlock,
  DraftInlineStyle,
  DraftDragType,
  EditorProps,
  DraftEditorCommand,
  CompositeDecorator,
  DraftDecorator,
  DraftHandleValue,
  DraftBlockRenderMap,
  EditorState,
  SelectionState,
} from 'draft-js';
import { createEditorStateWithTextFn } from 'draft-js-plugins-editor';
import { composeDecoratorsFn } from 'draft-js-plugins-editor';
// eslint-disable-next-line import/no-named-as-default
// import Editor from 'draft-js-plugins-editor/Editor';
export const createEditorStateWithText = createEditorStateWithTextFn;
export const composeDecorators = composeDecoratorsFn;
export type PluginMethods = {
  getPlugins: () => Array<Plugin>;
  getProps: () => EditorProps;
  setEditorState: (arg0: EditorState) => void;
  getEditorState: () => EditorState;
  getReadOnly: () => boolean;
  setReadOnly: (arg0: boolean) => void;
  getEditorRef: () => HTMLElement | null | undefined;
};
type HandleReturn = (
  e: React.KeyboardEvent,
  editorState: EditorState,
  arg2: PluginMethods,
) => DraftHandleValue;
type HandleKeyCommand = (
  command: DraftEditorCommand | string,
  editorState: EditorState,
  arg2: PluginMethods,
) => DraftHandleValue;
type HandleBeforeInput = (
  chars: string,
  editorState: EditorState,
  arg2: PluginMethods,
) => DraftHandleValue;
type HandlePastedText = (
  text: string,
  html: string | undefined,
  editorState: EditorState,
  arg3: PluginMethods,
) => DraftHandleValue;
type HandlePastedFiles = (
  files: Array<Blob>,
  arg1: PluginMethods,
) => DraftHandleValue;
type HandleDroppedFiles = (
  selection: SelectionState,
  files: Array<Blob>,
  arg2: PluginMethods,
) => DraftHandleValue;
type HandleDrop = (
  selection: SelectionState,
  dataTransfer: Record<string, any>,
  isInternal: DraftDragType,
  arg3: PluginMethods,
) => DraftHandleValue;
export type Handler =
  | HandleReturn
  | HandleKeyCommand
  | HandleBeforeInput
  | HandlePastedText
  | HandlePastedFiles
  | HandleDroppedFiles
  | HandleDrop;
export type PluginEditorProps = {
  editorState: EditorState;
  onChange: (arg0: EditorState, arg1?: PluginMethods) => void;
  textAlignment?: EditorProps['textAlignment'];
  textDirectionality?: EditorProps['textDirectionality'];
  placeholder?: string;
  plugins?: Array<EditorPlugin>;
  readOnly?: boolean;
  tabIndex?: number;
  spellCheck?: boolean;
  handleReturn?: HandleReturn;
  handleKeyCommand?: HandleKeyCommand;
  handleBeforeInput?: HandleBeforeInput;
  handlePastedText?: HandlePastedText;
  handlePastedFiles?: HandlePastedFiles;
  handleDroppedFiles?: HandleDroppedFiles;
  handleDrop?: HandleDrop;
  willUnmount?: (arg0: PluginMethods) => void;
  stripPastedStyles?: boolean;
  defaultKeyBindings?: boolean;
  defaultBlockRenderMap?: boolean;
  blockRendererFn?: (
    block: ContentBlock,
    arg1: PluginMethods,
  ) => Record<string, any> | null | undefined;
  blockStyleFn?: (block: ContentBlock, arg1: PluginMethods) => string;
  keyBindingFn?: (
    e: React.KeyboardEvent,
    arg1: PluginMethods,
  ) => string | null | undefined;
  onEscape?: OnEscape;
  onTab?: OnTab;
  onUpArrow?: OnUpArrow;
  onRightArrow?: OnRightArrow;
  onDownArrow?: OnDownArrow;
  onLeftArrow?: OnLeftArrow;
  onBlur?: OnBlur;
  onFocus?: OnFocus;
  blockRenderMap?: DraftBlockRenderMap;
  customStyleMap?: Record<string, any>;
  initialize?: (arg0: PluginMethods) => void;
  customStyleFn?: (
    style: DraftInlineStyle,
    block: ContentBlock,
    arg2: PluginMethods,
  ) => Record<string, any> | null | undefined;
  decorators?: Array<CompositeDecorator | DraftDecorator>;
  autoCapitalize?: string;
  autoComplete?: string;
  autoCorrect?: string;
  webDriverTestID?: string;
  ariaActiveDescendantID?: string;
  ariaAutoComplete?: string;
  ariaControls?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaMultiline?: boolean;
  ariaHasPopup?: boolean;
};
type OnEscape = (
  e: React.KeyboardEvent,
  arg1: PluginMethods,
) => boolean | null | undefined;
type OnTab = (
  e: React.KeyboardEvent,
  arg1: PluginMethods,
) => boolean | null | undefined;
type OnUpArrow = (
  e: React.KeyboardEvent,
  arg1: PluginMethods,
) => boolean | null | undefined;
type OnRightArrow = (
  e: React.KeyboardEvent,
  arg1: PluginMethods,
) => boolean | null | undefined;
type OnDownArrow = (
  e: React.KeyboardEvent,
  arg1: PluginMethods,
) => boolean | null | undefined;
type OnLeftArrow = (
  e: React.KeyboardEvent,
  arg1: PluginMethods,
) => boolean | null | undefined;
type OnBlur = (
  e: React.SyntheticEvent,
  arg1: PluginMethods,
) => boolean | null | undefined;
type OnFocus = (
  e: React.SyntheticEvent,
  arg1: PluginMethods,
) => boolean | null | undefined;
export type EditorPlugin = {
  blockRendererFn?: (
    block: ContentBlock,
    arg1: PluginMethods,
  ) => Record<string, any> | null | undefined;
  blockStyleFn?: (block: ContentBlock, arg1: PluginMethods) => string;
  keyBindingFn?: (
    e: React.KeyboardEvent,
    arg1: PluginMethods,
  ) => string | null | undefined;
  customStyleFn?: (
    style: DraftInlineStyle,
    block: ContentBlock,
    arg2: PluginMethods,
  ) => Record<string, any> | null | undefined;
  blockRenderMap?: DraftBlockRenderMap;
  customStyleMap?: Record<string, any>;
  handleReturn?: HandleReturn;
  handleKeyCommand?: HandleKeyCommand;
  handleBeforeInput?: HandleBeforeInput;
  handlePastedText?: HandlePastedText;
  handlePastedFiles?: HandlePastedFiles;
  handleDroppedFiles?: HandleDroppedFiles;
  getAccessibilityProps?: () => {
    ariaActiveDescendantID?: string;
    ariaAutoComplete?: string;
    ariaControls?: string;
    ariaDescribedBy?: string;
    ariaExpanded?: boolean;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaMultiline?: boolean;
    ariaHasPopup?: boolean;
  };
  handleDrop?: HandleDrop;
  onEscape?: OnEscape;
  onTab?: OnTab;
  onUpArrow?: OnUpArrow;
  onRightArrow?: OnRightArrow;
  onDownArrow?: OnDownArrow;
  onLeftArrow?: OnLeftArrow;
  onBlur?: OnBlur;
  onFocus?: OnFocus;
  onChange?: (arg0: EditorState, arg1: PluginMethods) => void;
  initialize?: (arg0: PluginMethods) => void;
  decorators?: Array<CompositeDecorator | DraftDecorator>;
  willUnmount?: (arg0: PluginMethods) => void;
};
export type PluginCreator = (config?: Record<string, any>) => Plugin;

// button 自定义按键
export interface KeyCommand {
  keyCode: KeyboardEvent['keyCode'];
  isShiftKeyCommand?: boolean; // e.shiftKey
  isCtrlKeyCommand?: boolean; // !!e.ctrlKey && !e.altKey
  isOptionKeyCommand?: boolean; // isOSX && e.altKey
  hasCommandModifier?: boolean; // isOSX ? !!e.metaKey && !e.altKey : !!e.ctrlKey && !e.altKey
}

export * from './utils/checkKeyCommand';
export * from './utils/blockInSelection';
export * from './utils/createBlockKeyStore';
export * from './utils/getBlockMapKeys';
export * from './utils/getSelectedBlocksMapKeys';
export * from './utils/isFirstBlock';
export * from './utils/isLastBlock';

export * from './modifiers/insertAtomicBlockWithoutSplit';

export { focusDecorator, BlockFocusDecoratorProps };

export default EEEditor;
