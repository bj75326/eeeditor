import React from 'react';
import { createStore, Store } from '@draft-js-plugins/utils';
import { EditorPlugin, DraftEditorCommand } from '@eeeditor/editor';
import Toolbar, {
  ToolbarPubProps,
  ToolbarChildrenProps,
  HeaderButtonIcon,
} from './components/Toolbar';
import SelectorButton, {
  SelectorButtonProps,
} from './components/SelectorButton';
import Separator, { SeparatorProps } from './components/Separator';
import { SelectionState, EditorState } from 'draft-js';

export interface Locale {}

// export interface StaticToolbarPluginConfig {
//   prefixCls?: string;
//   className?: string;
//   style?: string;
//   locale?: Locale;
// }

export const defaultSelectorBtnIcons = {
  HeaderButtonIcon,
};

export type StaticToolbarProps = ToolbarPubProps;

export type StaticToolbarChildrenProps = ToolbarChildrenProps;

export type StaticToolbarPlugin = EditorPlugin & {
  StaticToolbar: React.FC<StaticToolbarProps>;
  SelectorButton: React.FC<SelectorButtonProps>;
  Separator: React.FC<SeparatorProps>;
};

export interface StoreItemMap {
  getEditorState?(): EditorState;
  setEditorState?(state: EditorState): void;
  selection?: SelectionState;
  keyCommandHandlers?: EditorPlugin['handleKeyCommand'][];
  keyBindingFns?: EditorPlugin['keyBindingFn'][];
  beforeInputHandlers?: EditorPlugin['handleBeforeInput'][];
}

export type StaticToolbarPluginStore = Store<StoreItemMap>;

export default (): // config: StaticToolbarPluginConfig = {},
StaticToolbarPlugin => {
  const store = createStore<StoreItemMap>({
    keyCommandHandlers: [],
    keyBindingFns: [],
    beforeInputHandlers: [],
  });

  const StaticToolbar: React.FC<StaticToolbarProps> = (props) => (
    <Toolbar {...props} store={store} />
  );

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },
    // todo: Static toolbar plugin 是否需要这个 onChange
    onChange: (editorState) => {
      store.updateItem('selection', editorState.getSelection());
      return editorState;
    },

    keyBindingFn: (event, pluginFunctions) => {
      const keyBindingFns = store.getItem('keyBindingFns');
      let result: DraftEditorCommand | null = null;
      return keyBindingFns.some((fn) => {
        result = fn(event, pluginFunctions);
        return result !== null;
      })
        ? result
        : null;
    },

    handleKeyCommand: (
      command,
      editorState,
      eventTimeStamp,
      pluginFunctions,
    ) => {
      const keyCommandHandlers = store.getItem('keyCommandHandlers');
      return keyCommandHandlers.some(
        (handler) =>
          handler(command, editorState, eventTimeStamp, pluginFunctions) ===
          'handled',
      )
        ? 'handled'
        : 'not-handled';
    },

    handleBeforeInput: (
      chars,
      editorState,
      eventTimeStamp,
      pluginFunctions,
    ) => {
      console.log('beforeInput args!!!!: ', chars);
      console.log('beforeInput args!!!!: ', editorState);
      console.log('beforeInput args!!!!: ', eventTimeStamp);
      console.log('beforeInput args!!!!: ', pluginFunctions);
      const beforeInputHandlers = store.getItem('beforeInputHandlers');
      return beforeInputHandlers.some(
        (handler) =>
          handler(chars, editorState, eventTimeStamp, pluginFunctions) ===
          'handled',
      )
        ? 'handled'
        : 'not-handled';
    },

    StaticToolbar,

    SelectorButton,

    Separator,
  };
};
