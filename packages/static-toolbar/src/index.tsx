import React, { ComponentType } from 'react';
import { createStore, Store } from '@draft-js-plugins/utils';
import { EditorPlugin } from '@eeeditor/editor';
import Toolbar, { ToolbarPubProps } from './components/Toolbar';
import SelectorButton, {
  SelectorButtonProps,
} from './components/SelectorButton';
import { SelectionState, EditorState } from 'draft-js';

export interface Locale {}

// export interface StaticToolbarPluginConfig {
//   prefixCls?: string;
//   className?: string;
//   style?: string;
//   locale?: Locale;
// }

export type StaticToolbarProps = ToolbarPubProps;

export type StaticToolbarPlugin = EditorPlugin & {
  StaticToolbar: ComponentType<StaticToolbarProps>;
  SelectorButton: React.FC<SelectorButtonProps>;
};

export interface StoreItemMap {
  getEditorState?(): EditorState;
  setEditorState?(state: EditorState): void;
  selection?: SelectionState;
}

export type StaticToolbarPluginStore = Store<StoreItemMap>;

export default (): // config: StaticToolbarPluginConfig = {},
StaticToolbarPlugin => {
  const store = createStore<StoreItemMap>();

  const StaticToolbar: React.FC<StaticToolbarProps> = (props) => (
    <Toolbar {...props} store={store} />
  );

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },
    // todo Static toolbar plugin 是否需要这个 onChange
    onChange: (editorState) => {
      store.updateItem('selection', editorState.getSelection());
      return editorState;
    },

    StaticToolbar,

    SelectorButton,
  };
};
