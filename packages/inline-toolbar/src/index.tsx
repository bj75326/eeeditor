import React from 'react';
import {
  EditorPlugin,
  SelectionState,
  PluginMethods,
  EditorState,
} from '@eeeditor/editor';
import { createStore, Store } from '@draft-js-plugins/utils';
import Toolbar, {
  ToolbarPubProps,
  ToolbarChildrenProps,
} from './components/Toolbar';
import OverrideButton, {
  OverrideButtonProps,
} from './components/OverrideButton';
import Separator, { SeparatorProps } from './components/Separator';
import containsNode from 'fbjs/lib/containsNode';
import getDraftEditorSelection from 'draft-js/lib/getDraftEditorSelection';

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

    // 1. 鼠标操作触发 focus
    // onWrapperMouseDown ---> onFocus (不触发 toolbar 更新) --
    // -> onSelect (selectionState 有变化则触发 toolbar 更新) --
    // -> onWrapperSelect （selectionState 没有变化仍需要触发 toolbar 更新）---> end
    // 2. 非鼠标操作触发 focus
    // onFocus (触发 toolbar 更新) ---> end

    onWrapperMouseDown: (e, { getEditorRef, getEditorState }) => {
      const hasFocus = getEditorState().getSelection().getHasFocus();

      // 判断是否是通过鼠标事件触发 editor focus 事件
      if (containsNode(getEditorRef().editor, e.target as Node) && !hasFocus) {
        withMouseDown = true;
      }

      return false;
    },

    onFocus: (e) => {
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

    onWrapperSelect: (e, { getEditorRef, getEditorState }) => {
      // 鼠标操作触发 focus 事件，如果光标位置与上次 blur 之前位置相同，
      // selectionState 没有变化，则 onSelect 不会触发 update，
      // 即便此时的 selectionState 满足 inline toolbar 显示要求，
      // 所以需要在 onWrapperSelect 内，判断 selectionState 没有变化时，仍然需要触发更新
      if (preventToolbarVisible) {
        preventToolbarVisible = false;
        if (getEditorRef().editor) {
          const documentSelection = getDraftEditorSelection(
            getEditorState(),
            getEditorRef().editor,
          );
          const updatedSelectionState = documentSelection.selectionState;
          if (updatedSelectionState === getEditorState().getSelection()) {
            let editorState = getEditorState();
            if (documentSelection.needsRecovery) {
              editorState = EditorState.forceSelection(
                editorState,
                updatedSelectionState,
              );
            } else {
              editorState = EditorState.acceptSelection(
                editorState,
                updatedSelectionState,
              );
            }

            // if (shouldSideToolbarVisible(editorState)) {
            //   store.updateItem('editorState', editorState);
            // }
          }
        }
      }

      return false;
    },

    onChange: (editorState) => {
      if (!preventToolbarVisible) {
        store.updateItem('selection', editorState.getSelection());
      } else {
        preventToolbarVisible = false;
      }
      return editorState;
    },

    suffix: () => <div className="inline-toolbar-plugin-suffix"></div>,

    InlineToolbar,

    OverrideButton,

    Separator,
  };
};
