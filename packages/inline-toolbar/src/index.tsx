import React from 'react';
import {
  EditorPlugin,
  EditorState,
  EditorProps,
  SelectionState,
  ExtraPluginEditorProps,
  PluginMethods,
} from '@eeeditor/editor';
import { createStore, Store } from '@draft-js-plugins/utils';
import Toolbar, {
  ToolbarPubProps,
  ToolbarChildrenProps,
} from './components/Toolbar';

export type InlineToolbarProps = ToolbarPubProps;

export type InlineToolbarChildrenProps = ToolbarChildrenProps;

export type InlineToolbarPlugin = EditorPlugin & {
  InlineToolbar: React.FC<InlineToolbarProps>;
};

export interface StoreItemMap extends Partial<PluginMethods> {
  selection?: SelectionState;
  keyCommandHandlers?: EditorPlugin['handleKeyCommand'][];
  keyBindingFns?: EditorPlugin['keyBindingFn'][];
  beforeInputHandlers?: EditorPlugin['handleBeforeInput'][];
}

export type InlineToolbarPluginStore = Store<StoreItemMap>;

export default (): InlineToolbarPlugin => {
  const store = createStore<StoreItemMap>({
    keyCommandHandlers: [],
    keyBindingFns: [],
    beforeInputHandlers: [],
  });

  const InlineToolbar: React.FC<InlineToolbarProps> = (props) => (
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

    InlineToolbar,
  };
};
