import React from 'react';
import { EditorPlugin, SelectionState, PluginMethods } from '@eeeditor/editor';
import { createStore, Store } from '@draft-js-plugins/utils';
import Toolbar, {
  ToolbarPubProps,
  ToolbarChildrenProps,
} from './components/Toolbar';
import OverrideButton, {
  OverrideButtonProps,
} from './components/OverrideButton';
import Separator, { SeparatorProps } from './components/Separator';

export type InlineToolbarProps = ToolbarPubProps;

export type InlineToolbarChildrenProps = ToolbarChildrenProps;

export type InlineToolbarPlugin = EditorPlugin & {
  InlineToolbar: React.FC<InlineToolbarProps>;
  OverrideButton: React.FC<OverrideButtonProps>;
  Separator: React.FC<SeparatorProps>;
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

    onChange: (editorState) => {
      store.updateItem('selection', editorState.getSelection());
      return editorState;
    },

    suffix: () => <div className="inline-toolbar-plugin-suffix"></div>,

    InlineToolbar,

    OverrideButton,

    Separator,
  };
};
