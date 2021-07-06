import React from 'react';
import {
  EditorPlugin,
  EditorState,
  EditorProps,
  SelectionState,
  ExtraPluginEditorProps,
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

export interface StoreItemMap {
  getEditorState?(): EditorState;
  setEditorState?(state: EditorState): void;
  getProps?(): EditorProps & ExtraPluginEditorProps;
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
    initialize: ({
      getEditorState,
      setEditorState,
      getProps,
      getEditorRef,
    }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
      store.updateItem('getProps', getProps);
      // store.updateItem('get');
    },
    // todo: Static toolbar plugin 是否需要这个 onChange
    onChange: (editorState) => {
      store.updateItem('selection', editorState.getSelection());
      return editorState;
    },

    InlineToolbar,
  };
};
