import React from 'react';
import {
  EditorPlugin,
  PluginMethods,
  EditorState,
  getEditorRootDomNode,
  isOnlyFocusChanged,
} from '@eeeditor/editor';
import { createStore, Store } from '@draft-js-plugins/utils';
import Toolbar, {
  ToolbarPubProps,
  ToolbarChildrenProps,
} from './components/Toolbar';
import shouldSideToolbarVisible from './utils/shouldSideToolbarVisible';
import { getDraftEditorSelection } from 'draft-js/lib/getDraftEditorSelection';

export type SideToolbarProps = ToolbarPubProps;

export type SideToolbarChildrenProps = ToolbarChildrenProps;

export type SideToolbarPlugin = EditorPlugin & {
  SideToolbar: React.FC<SideToolbarProps>;
};

export interface StoreItemMap extends Partial<PluginMethods> {
  editorState?: EditorState;
  keyCommandHandlers?: EditorPlugin['handleKeyCommand'][];
  keyBindingFns?: EditorPlugin['keyBindingFn'][];
  beforeInputHandlers?: EditorPlugin['handleBeforeInput'][];
}

export type SideToolbarPluginStore = Store<StoreItemMap>;

export default (): SideToolbarPlugin => {
  const store: SideToolbarPluginStore = createStore<StoreItemMap>({
    keyCommandHandlers: [],
    keyBindingFns: [],
    beforeInputHandlers: [],
  });

  const SideToolbar: React.FC<SideToolbarProps> = (props) => (
    <Toolbar {...props} store={store} />
  );

  // onFocus 事件导致的 editorState 变化不应该影响 toolbar 的 visible 变化
  // let preventToolbarVisible: boolean = false;

  return {
    initialize: (pluginMethods) => {
      Object.keys(pluginMethods).forEach((pluginMethod) => {
        store.updateItem(
          pluginMethod as keyof StoreItemMap,
          pluginMethods[pluginMethod],
        );
      });
    },

    // onFocus: (e) => {
    //   preventToolbarVisible = true;
    //   return false;
    // },

    onWrapperSelect: (e, { getEditorState, setEditorState, getEditorRef }) => {
      // if (preventToolbarVisible) {

      //   preventToolbarVisible = false;
      // }
      return false;
    },

    onChange: (editorState, { getEditorState }) => {
      console.log(
        'isOnlyFocusChanged ',
        isOnlyFocusChanged(editorState, getEditorState()),
      );

      store.updateItem('editorState', editorState);

      return editorState;
    },

    suffix: () => <div className="side-toolbar-plugin-suffix"></div>,

    SideToolbar,
  };
};
