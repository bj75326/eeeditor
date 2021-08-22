import React from 'react';
import { EditorPlugin, PluginMethods, EditorState } from '@eeeditor/editor';
import { createStore, Store } from '@draft-js-plugins/utils';
import Toolbar, {
  ToolbarPubProps,
  ToolbarChildrenProps,
} from './components/Toolbar';
import shouldSideToolbarVisible from './utils/shouldSideToolbarVisible';
import containsNode from 'fbjs/lib/containsNode';
import getDraftEditorSelection from 'draft-js/lib/getDraftEditorSelection';

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

    onWrapperSelect: (e, { getEditorState, getEditorRef }) => {
      // 鼠标操作触发 focus 事件，如果光标位置与上次 blur 之前位置相同，
      // selectionState 没有变化，则 onSelect 不会触发 update，
      // 即便此时的 selectionState 满足 side toolbar 显示要求，
      // 所以需要在 onWrapperSelect 内，判断 selectionState 没有变化时，仍然需要触发更新

      if (withMouseDown) {
        // 当切换浏览器 tab 或者切换当前应用触发 focus 事件后，select 区域不变的情况下仍然会触发一次 select 事件，
        // 这回导致 onWrapperSelect 多执行一次引发一些意想不到的结果，比如：
        // 切换回来之后，点击 side toolbar，toggleToolbarExpanded 执行之后，onWrapperSelect 也会执行一次并且
        // 触发 side toolbar 重新渲染，导致 toolbar expanded 之后又立刻 unexpanded
        // 所以 onWrapperSelect 应该确保只有在鼠标操作触发 focus 的情况下会被执行
        withMouseDown = false;

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

            if (shouldSideToolbarVisible(editorState)) {
              store.updateItem('editorState', editorState);
            }
          }
        }
      }

      return false;
    },

    onChange: (editorState) => {
      if (!preventToolbarVisible) {
        store.updateItem('editorState', editorState);
      } else {
        preventToolbarVisible = false;
      }

      return editorState;
    },

    suffix: () => <div className="side-toolbar-plugin-suffix"></div>,

    SideToolbar,
  };
};
