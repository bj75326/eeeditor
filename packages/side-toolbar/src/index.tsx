import React from 'react';
import {
  EditorPlugin,
  PluginMethods,
  EditorState,
  getEditorRootDomNode,
  isFocus,
} from '@eeeditor/editor';
import { createStore, Store } from '@draft-js-plugins/utils';
import Toolbar, {
  ToolbarPubProps,
  ToolbarChildrenProps,
} from './components/Toolbar';
import shouldSideToolbarVisible from './utils/shouldSideToolbarVisible';
import { getDraftEditorSelection } from 'draft-js/lib/getDraftEditorSelection';
import containsNode from 'fbjs/lib/containsNode';

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
  let withMouseDown: boolean = false;
  let preventToolbarVisible: boolean = false;

  return {
    initialize: (pluginMethods) => {
      Object.keys(pluginMethods).forEach((pluginMethod) => {
        store.updateItem(
          pluginMethod as keyof StoreItemMap,
          pluginMethods[pluginMethod],
        );
      });
    },

    onWrapperMouseDown: (e, { getEditorRef, getEditorState }) => {
      console.log('wrapper onWrapperMouseDown');

      const hasFocus = getEditorState().getSelection().getHasFocus();

      // 判断是否是通过鼠标事件触发 editor focus 事件
      if (containsNode(getEditorRef().editor, e.target as Node) && !hasFocus) {
        withMouseDown = true;
      }

      return false;
    },

    onFocus: (e) => {
      console.log('editor onFocus');

      if (withMouseDown) {
        // 鼠标操作触发 focus 事件，side toolbar visibe 控制放到 select 事件中
        withMouseDown = false;
        preventToolbarVisible = true;
      } else {
        // 非鼠标操作触发 focus 事件，需要在 focus 事件内判断 visible
        // 例如：
        // 1. 浏览器 tag 切换回来时触发 focus
        // 2. tab 键
        // 3. editor.focus() 方法
        preventToolbarVisible = false;
      }

      return false;
    },

    onWrapperSelect: (e, { getEditorState, setEditorState, getEditorRef }) => {
      console.log('wrapper onWrapperSelect');

      // 鼠标操作触发 focus 事件，如果光标位置与上次 blur 之前位置相同，
      // selectionState 在 onFocus 之后没有变化，则 onSelect 不会调用 onChange
      // 所以在 onWrapperSelect 内，判断 selectionState 没有变化时，仍然需要更新 toolbar visible

      if (preventToolbarVisible) {
        preventToolbarVisible = false;

        // todo.
      }

      return false;
    },

    onBlur: () => {
      // todo.

      return false;
    },

    onChange: (editorState, { getEditorState }) => {
      if (!preventToolbarVisible) {
        store.updateItem('editorState', editorState);
      }

      return editorState;
    },

    suffix: () => <div className="side-toolbar-plugin-suffix"></div>,

    SideToolbar,
  };
};
