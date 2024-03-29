import React from 'react';
import { createStore, Store } from '@draft-js-plugins/utils';
import {
  EditorPlugin,
  EditorProps,
  ExtraPluginEditorProps,
  PluginMethods,
  SelectionState,
  EditorState,
} from '@eeeditor/editor';
import Toolbar, {
  ToolbarPubProps,
  ToolbarChildrenProps,
} from './components/Toolbar';
import SelectorButton, {
  SelectorButtonProps,
} from './components/SelectorButton';
import Separator, { SeparatorProps } from './components/Separator';

export type StaticToolbarProps = ToolbarPubProps;

export type StaticToolbarChildrenProps = ToolbarChildrenProps;

export type StaticToolbarPlugin = EditorPlugin & {
  StaticToolbar: React.FC<StaticToolbarProps>;
  SelectorButton: React.FC<SelectorButtonProps>;
  Separator: React.FC<SeparatorProps>;
};

export interface StoreItemMap extends Partial<PluginMethods> {
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
    initialize: (pluginMethods) => {
      Object.keys(pluginMethods).forEach((pluginMethod) => {
        store.updateItem(
          pluginMethod as keyof StoreItemMap,
          pluginMethods[pluginMethod],
        );
      });
    },
    // todo: Static toolbar plugin 是否需要这个 onChange
    onChange: (editorState) => {
      store.updateItem('selection', editorState.getSelection());
      return editorState;
    },

    keyBindingFn: (event, pluginFunctions) => {
      console.log('static toolabr keyBindingFn');
      const keyBindingFns = store.getItem('keyBindingFns');
      let result: string | null | undefined = undefined;
      return keyBindingFns.some((fn) => {
        result = fn(event, pluginFunctions);
        return result !== undefined;
      })
        ? result
        : undefined;
    },

    handleKeyCommand: (command, editorState, pluginFunctions) => {
      const keyCommandHandlers = store.getItem('keyCommandHandlers');
      return keyCommandHandlers.some(
        (handler) =>
          handler(command, editorState, pluginFunctions) === 'handled',
      )
        ? 'handled'
        : 'not-handled';
    },

    handleBeforeInput: (chars, editorState, pluginFunctions) => {
      const beforeInputHandlers = store.getItem('beforeInputHandlers');
      return beforeInputHandlers.some(
        (handler) => handler(chars, editorState, pluginFunctions) === 'handled',
      )
        ? 'handled'
        : 'not-handled';
    },

    StaticToolbar,

    SelectorButton,

    Separator,
  };
};
