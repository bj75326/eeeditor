import {
  EditorState,
  SelectionState,
  ContentState,
  EditorPlugin,
  getRangeCoords,
  getSelectionCoords,
  PluginMethods,
} from '../..';
import insertNewLineBefore from '../../modifiers/insertNewLineBefore';
import setSelection from '../../modifiers/setSelection';
import createDecorator, { BlockFocusDecoratorProps } from './createDecorator';
import createBlockKeyStore, {
  BlockKeyStore,
} from '../../utils/createBlockKeyStore';
import blockInSelection from '../../utils/blockInSelection';
import getBlockMapKeys from '../../utils/getBlockMapKeys';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import removeBlock from '../../modifiers/removeBlock';
import setSelectionToAtomicBlock from '../../utils/setSelectionToAtomicBlock';
import containsNode from 'fbjs/lib/containsNode';
import getDraftEditorSelection from 'draft-js/lib/getDraftEditorSelection';
import { Store, createStore } from '@draft-js-plugins/utils';

export interface StoreItemMap extends Partial<PluginMethods> {}

export type FocusPluginStore = Store<StoreItemMap>;

// 有且仅有 focusable Block 被选中
const focusableBlockIsSelected = (
  editorState: EditorState,
  blockKeyStore: BlockKeyStore,
): boolean => {
  const selection = editorState.getSelection();
  if (selection.getAnchorKey() !== selection.getFocusKey()) {
    return false;
  }
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(selection.getAnchorKey());
  return blockKeyStore.includes(block.getKey());
};

const getLastLeafNode = (node: Node): Node => {
  if (node.hasChildNodes()) {
    return getLastLeafNode(node.lastChild);
  }
  return node;
};

const getFirstLeafNode = (node: Node): Node => {
  if (node.hasChildNodes()) {
    return getFirstLeafNode(node.firstChild);
  }
  return node;
};

const textLineInBetweenExisted = (
  editorState: EditorState,
  mode: 'up' | 'down',
): boolean => {
  const selection = editorState.getSelection();
  const selectionKey =
    mode === 'up' ? selection.getStartKey() : selection.getEndKey();
  const offsetKey = DraftOffsetKey.encode(selectionKey, 0, 0);
  const node = document.querySelector(
    `[data-offset-key="${offsetKey}"][data-block="true"]`,
  );
  const leafNode =
    mode === 'up' ? getFirstLeafNode(node) : getLastLeafNode(node);
  let offset = 0;
  if (mode === 'up') {
    offset = 0;
  } else {
    if ((leafNode as Text).length && (leafNode as Text).length >= 0) {
      offset = (leafNode as Text).length;
    } else {
      offset = 0;
    }
  }

  const referenceRange = document.createRange();
  referenceRange.setStart(leafNode, offset);
  referenceRange.setEnd(leafNode, offset);

  const rangeAtBlockEndCoords = getRangeCoords(referenceRange);

  const currentRangeCoords = getSelectionCoords(mode === 'up' ? true : false);

  if (rangeAtBlockEndCoords.y !== currentRangeCoords.y) {
    return true;
  }
  return false;
};

const deleteCommands = [
  'backspace',
  'backspace-word',
  'backspace-to-start-of-line',
  'delete',
  'delete-word',
  'delete-to-end-of-block',
];

export { BlockFocusDecoratorProps };

export interface FocusEditorPluginConfig {}

type FocusEditorPlugin = EditorPlugin & {
  decorator: ReturnType<typeof createDecorator>;
};

export default (config: FocusEditorPluginConfig = {}): FocusEditorPlugin => {
  const blockKeyStore = createBlockKeyStore();
  // let lastSelection: SelectionState | undefined;
  // let lastContentState: ContentState | undefined;

  // onFocus 事件导致的 editorState 变化不应该影响 focusable block 的 isFocused 值变化
  let withMouseDown: boolean = false;

  const store = createStore<StoreItemMap>();

  return {
    initialize: (pluginMethods: PluginMethods) => {
      Object.keys(pluginMethods).forEach((methodName: keyof PluginMethods) => {
        store.updateItem(methodName, pluginMethods[methodName]);
      });
    },

    handleReturn: (event, editorState, { setEditorState }) => {
      // 如果当前有且仅有 focusable block 被选中：
      // 按下 Return 则会在 focusable block 前插入一个新的 text block
      if (focusableBlockIsSelected(editorState, blockKeyStore)) {
        setEditorState(insertNewLineBefore(editorState));
        return 'handled';
      }
      // 如果当前 selectionState start block 为 focusable block ：
      // eeeditor focusable block 的 reviseAtomicBlockSelection 方法会在 focusable block 为 anchor
      // 或者 focus 节点的时候将 selection 限制在当前 block 内，因此这种情况暂时不考虑
      // 返回 'not-handled' 执行默认处理

      // 如果当前 selectionState end block 为 focusable block ：
      // 同上一种情况

      // 如果当前 selectionState 包含 focusable block ，但 start/end 不是 focusable block ：
      // 返回 'not-handled' 执行默认处理
      return 'not-handled';
    },

    // 本来想使用 draft-js 提供的默认方法操作 focusable atomic block 的 删除操作，但是默认方法本身是为删除文本设计，
    // 删除 atomic block 之后，会在 selectionAfter 之后的位置对出一个空白位，所以 focus plugin 提供了相应的
    // handleKeyCommand。
    handleKeyCommand: (command, editorState, { setEditorState }) => {
      // 如果当前有且仅有 focusable block 被选中：
      // delete command
      if (
        deleteCommands.includes(command) &&
        focusableBlockIsSelected(editorState, blockKeyStore)
      ) {
        const key = editorState.getSelection().getStartKey();
        const newEditorState = removeBlock(editorState, key);
        if (newEditorState !== editorState) {
          setEditorState(newEditorState);
          return 'handled';
        }
      }

      // 如果当前 selectionState start block 为 focusable block ：
      // eeeditor focusable block 会在 focusable block 为 anchor
      // 或者 focus 节点的时候将 selection 限制在当前 block 内，因此这种情况暂时不考虑
      // 返回 'not-handled' 执行默认处理

      // 如果当前 selectionState end block 为 focusable block ：
      // 同上一种情况

      // 如果当前 selectionState 包含 focusable block ，但 start/end 不是 focusable block
      // 返回 'not-handled' 执行默认处理

      return 'not-handled';
    },

    // lastContentState lastSelection 逻辑不易理解，作废
    // onChange: (editorState) => {
    //   // in case the content changed there is no need to re-render blockRendererFn
    //   // since if a block was added it will be rendered anyway and if it was text
    //   // then the change was not a pure selection change
    //   const contentState = editorState.getCurrentContent();
    //   if (!contentState.equals(lastContentState!)) {
    //     lastContentState = contentState;
    //     console.log(1);
    //     return editorState;
    //   }
    //   lastContentState = contentState;

    //   // if the selection didn't change there is no need to re-render
    //   const selection = editorState.getSelection();

    //   if (lastSelection && selection.equals(lastSelection)) {
    //     lastSelection = selection;
    //     console.log(2);
    //     return editorState;
    //   }

    //   // editor blur 时不需要使用 forceSelection 强制 re-render 以触发 blockRendererFn
    //   // 参考 DraftEditorContents shouldComponentUpdate 方法，当 hasFocus 发生变化时，
    //   // shouldComponentUpdate 直接返回 true。
    //   // 另外，forceSelection 会强制更改 hasFocus 为 true，使得 blur 发生时，focusable block 状态出现 bug
    //   if (
    //     !selection.getHasFocus()
    //     // && getEditorState().getSelection().getHasFocus()
    //   ) {
    //     console.log(3);
    //     return editorState;
    //   }

    //   // contentState 没有变化，但 selectionState 发生变化时，只有在 lastSelection 或者
    //   // 当前 selection 包含 focusable block 时，需要通过 forceSelection 重新触发 blockRendererFn
    //   const focusableBlockKeys = blockKeyStore.getAll();
    //   if (lastSelection) {
    //     const lastBlockMapKeys = getBlockMapKeys(
    //       contentState,
    //       lastSelection.getStartKey(),
    //       lastSelection.getEndKey(),
    //     );
    //     if (lastBlockMapKeys.some((key) => focusableBlockKeys.includes(key!))) {
    //       lastSelection = selection;
    //       // By forcing the selection the editor will trigger the blockRendererFn which is
    //       // necessary for the blockProps containing isFocus to be passed down again.
    //       console.log(4);
    //       return EditorState.forceSelection(
    //         editorState,
    //         editorState.getSelection(),
    //       );
    //     }
    //   }

    //   const currentBlockMapKeys = getBlockMapKeys(
    //     contentState,
    //     selection.getStartKey(),
    //     selection.getEndKey(),
    //   );
    //   if (
    //     currentBlockMapKeys.some((key) => focusableBlockKeys.includes(key!))
    //   ) {
    //     lastSelection = selection;
    //     // By forcing the selection the editor will trigger the blockRendererFn which is
    //     // necessary for the blockProps containing isFocus to be passed down again.
    //     console.log(5);
    //     return EditorState.forceSelection(
    //       editorState,
    //       editorState.getSelection(),
    //     );
    //   }
    //   console.log(6);
    //   return editorState;
    // },

    onChange: (editorState, { getEditorState }) => {
      // focus plugin onChange 的作用是在 contentState 没有变化 selectionState 有变化时，如果有 focusable
      // block 新增被选中或者被不选中，需要通过 forceSelection 强制刷新，使 blockRendererFn 执行计算得到新的
      // blockProps.isFocused。

      const nextContentState = editorState.getCurrentContent();
      const nextSelection = editorState.getSelection();

      const currContentState = getEditorState().getCurrentContent();
      const currSelection = getEditorState().getSelection();

      // 当 contentState 发生变化时，直接返回新的 editorState
      if (!nextContentState.equals(currContentState)) {
        console.log(1);
        return editorState;
      }

      // 当 selectionState 没有变化时，直接返回新的 editorState
      if (nextSelection.equals(currSelection)) {
        console.log(2);
        return editorState;
      }

      // 当 editor 失去焦点时，直接返回新的 editorState。hasFocus 的变化，
      // DraftEditorContents shouldComponentUpdate 一定会返回 true
      if (!nextSelection.getHasFocus()) {
        console.log(3);
        return editorState;
      }

      const focusableBlockKeys = blockKeyStore.getAll();

      const nextSelectedBlockMapKeys = getBlockMapKeys(
        nextContentState,
        nextSelection.getStartKey(),
        nextSelection.getEndKey(),
      );

      const currSelectedBlockMapKeys = getBlockMapKeys(
        currContentState,
        currSelection.getStartKey(),
        currSelection.getEndKey(),
      );

      // 存在被选中的 focusable block 之前没有被选中，或者，存在之前被选中的 focusable block 没有被选中
      if (
        nextSelectedBlockMapKeys.some(
          (key) =>
            focusableBlockKeys.includes(key) &&
            !currSelectedBlockMapKeys.includes(key),
        ) ||
        currSelectedBlockMapKeys.some(
          (key) =>
            focusableBlockKeys.includes(key) &&
            !nextSelectedBlockMapKeys.includes(key),
        )
      ) {
        console.log(4);
        return EditorState.forceSelection(editorState, nextSelection);
      }
      console.log(5);
      return editorState;
    },

    // keyBindingFn 不会处理 arrow key 事件，而是通过 Plugin 的 onDownArrow/onUpArrow/onRightArrow/onLeftArrow 处理
    // 因此这里不需要设置 keyBindingFn

    // TODO edgecase: if one block is selected and the user wants to expand the selection using the shift key
    // keyBindingFn (evt, { getEditorState, setEditorState }) {
    //   console.log('focus keyBindingFn');
    //   const editorState = getEditorState();
    //   // TODO match by entitiy instead of block type
    //   if (focusableBlockIsSelected(editorState, blockKeyStore)) {
    //     // arrow left
    //     if (evt.keyCode === 37) {
    //       setSelection(getEditorState, setEditorState, 'up', evt);
    //     }
    //     // arrow right
    //     if (evt.keyCode === 39) {
    //       setSelection(getEditorState, setEditorState, 'down', evt);
    //     }
    //     // arrow up
    //     if (evt.keyCode === 38) {
    //       setSelection(getEditorState, setEditorState, 'up', evt);
    //     }
    //     // arrow down
    //     if (evt.keyCode === 40) {
    //       setSelection(getEditorState, setEditorState, 'down', evt);
    //     }
    //     return undefined;
    //   }

    //   // Don't manually overwrite in case the shift key is used to avoid breaking
    //   // native behaviour that works anyway.
    //   if (evt.shiftKey) {
    //     return undefined;
    //   }

    //   // arrow left
    //   if (evt.keyCode === 37) {
    //     // Covering the case to select the before block
    //     const selection = editorState.getSelection();
    //     const selectionKey = selection.getAnchorKey();
    //     const beforeBlock = editorState
    //       .getCurrentContent()
    //       .getBlockBefore(selectionKey);
    //     // only if the selection caret is a the left most position
    //     if (
    //       beforeBlock &&
    //       selection.getAnchorOffset() === 0 &&
    //       blockKeyStore.includes(beforeBlock.getKey())
    //     ) {
    //       setSelection(getEditorState, setEditorState, 'up', evt);
    //     }
    //   }

    //   // arrow right
    //   if (evt.keyCode === 39) {
    //     // Covering the case to select the after block
    //     const selection = editorState.getSelection();
    //     const selectionKey = selection.getFocusKey();
    //     const currentBlock = editorState
    //       .getCurrentContent()
    //       .getBlockForKey(selectionKey);
    //     const afterBlock = editorState
    //       .getCurrentContent()
    //       .getBlockAfter(selectionKey);
    //     const notAtomicAndLastPost =
    //       currentBlock.getType() !== 'atomic' &&
    //       currentBlock.getLength() === selection.getFocusOffset();
    //     if (
    //       afterBlock &&
    //       notAtomicAndLastPost &&
    //       blockKeyStore.includes(afterBlock.getKey())
    //     ) {
    //       setSelection(getEditorState, setEditorState, 'down', evt);
    //     }
    //   }

    //   // arrow up
    //   if (evt.keyCode === 38) {
    //     // Covering the case to select the before block with arrow up
    //     const selectionKey = editorState.getSelection().getAnchorKey();
    //     const beforeBlock = editorState
    //       .getCurrentContent()
    //       .getBlockBefore(selectionKey);
    //     if (beforeBlock && blockKeyStore.includes(beforeBlock.getKey())) {
    //       setSelection(getEditorState, setEditorState, 'up', evt);
    //     }
    //   }

    //   // arrow down
    //   if (evt.keyCode === 40) {
    //     // Covering the case to select the after block with arrow down
    //     console.log('focus plugin keyBindingFn arrow down !!!');
    //     const selectionKey = editorState.getSelection().getAnchorKey();
    //     const afterBlock = editorState
    //       .getCurrentContent()
    //       .getBlockAfter(selectionKey);
    //     if (afterBlock && blockKeyStore.includes(afterBlock.getKey())) {
    //       setSelection(getEditorState, setEditorState, 'down', evt);
    //     }
    //   }
    //   return undefined;
    // },

    onDownArrow: (evt, { getEditorState, setEditorState }) => {
      const editorState = getEditorState();
      if (focusableBlockIsSelected(editorState, blockKeyStore)) {
        setSelection(getEditorState, setEditorState, 'down', evt);
        return false;
      }

      if (evt.shiftKey) {
        return false;
      }

      const selectionKey = editorState.getSelection().getEndKey();

      const afterBlock = editorState
        .getCurrentContent()
        .getBlockAfter(selectionKey);
      if (
        afterBlock &&
        blockKeyStore.includes(afterBlock.getKey()) &&
        !textLineInBetweenExisted(editorState, 'down')
      ) {
        setSelection(getEditorState, setEditorState, 'down', evt);
      }
      return false;
    },

    onUpArrow: (evt, { getEditorState, setEditorState }) => {
      console.log('onUpArrow');
      const editorState = getEditorState();
      if (focusableBlockIsSelected(editorState, blockKeyStore)) {
        setSelection(getEditorState, setEditorState, 'up', evt);
        return false;
      }

      if (evt.shiftKey) {
        return false;
      }

      const selectionKey = editorState.getSelection().getStartKey();
      const beforeBlock = editorState
        .getCurrentContent()
        .getBlockBefore(selectionKey);
      if (
        beforeBlock &&
        blockKeyStore.includes(beforeBlock.getKey()) &&
        !textLineInBetweenExisted(editorState, 'up')
      ) {
        setSelection(getEditorState, setEditorState, 'up', evt);
      }

      return false;
    },

    onRightArrow: (evt, { getEditorState, setEditorState }) => {
      const editorState = getEditorState();
      if (focusableBlockIsSelected(editorState, blockKeyStore)) {
        setSelection(getEditorState, setEditorState, 'down', evt);
        return false;
      }

      if (evt.shiftKey) {
        return false;
      }

      const selection = editorState.getSelection();

      if (!selection.isCollapsed()) {
        return false;
      }

      const selectionKey = selection.getEndKey();
      const currentBlock = editorState
        .getCurrentContent()
        .getBlockForKey(selectionKey);
      const afterBlock = editorState
        .getCurrentContent()
        .getBlockAfter(selectionKey);
      const notAtomicAndLastPost =
        currentBlock.getType() !== 'atomic' &&
        currentBlock.getLength() === selection.getEndOffset();
      if (
        afterBlock &&
        notAtomicAndLastPost &&
        blockKeyStore.includes(afterBlock.getKey())
      ) {
        setSelection(getEditorState, setEditorState, 'down', evt);
      }
      return false;
    },

    onLeftArrow: (evt, { getEditorState, setEditorState }) => {
      const editorState = getEditorState();
      if (focusableBlockIsSelected(editorState, blockKeyStore)) {
        setSelection(getEditorState, setEditorState, 'up', evt);
        return false;
      }

      if (evt.shiftKey) {
        return false;
      }

      const selection = editorState.getSelection();

      if (!selection.isCollapsed()) {
        return false;
      }

      const selectionKey = selection.getStartKey();
      const beforeBlock = editorState
        .getCurrentContent()
        .getBlockBefore(selectionKey);
      // only if the selection caret is a the left most position
      if (
        beforeBlock &&
        selection.getStartOffset() === 0 &&
        blockKeyStore.includes(beforeBlock.getKey())
      ) {
        setSelection(getEditorState, setEditorState, 'up', evt);
      }
      return false;
    },

    // onBlur: (event, { getEditorState, setEditorState }) => {
    //   // 如果当前焦点为 focusable block 时，当 blur 事件触发，eeeditor selectionState
    //   // 在下次 focus 事件触发的时候重新渲染整个 editor，会导致 blur 时已经获取焦点的 focusable block
    //   // 再次被渲染为 isFocused 的状态。所以在 eeeditor blur 时，手动将 editor selectionState
    //   // 设置到文末，eeeditor 应该确保文末段位不为 atomic。

    //   setTimeout(() => {
    //     setEditorState(EditorState.moveSelectionToEnd(getEditorState()));
    //   }, 0);

    //   return false;
    // },

    // 1. 鼠标操作触发 focus
    // onWrapperMouseDown (withMouseDown = true) ---> onFocus (blockRendererFn isFocused 值不变) --
    // -> onSelect (selectionState 有变化则 update editorState, 如果 selection 含有 focusable block，
    // onChange 内会改 forceSelection) --
    // -> onWrapperSelect （selectionState 没有变化仍需要判断是否需要 forceSelection 以执行 blockRendererFn ）--
    // -> end
    // 2. 非鼠标操作触发 focus
    // onFocus (触发 blockRendererFn 更新 isFocused) ---> end

    onWrapperMouseDown: (e, { getEditorRef, getEditorState }) => {
      const hasFocus = getEditorState().getSelection().getHasFocus();

      // 判断是否是通过鼠标事件触发 editor focus 事件
      if (containsNode(getEditorRef().editor, e.target as Node) && !hasFocus) {
        withMouseDown = true;
      }

      return false;
    },

    onWrapperSelect: (e, { getEditorRef, getEditorState, setEditorState }) => {
      if (withMouseDown) {
        withMouseDown = false;
        if (getEditorRef().editor) {
          const documentSelection = getDraftEditorSelection(
            getEditorState(),
            getEditorRef().editor,
          );
          const updatedSelectionState = documentSelection.selectionState;
          if (updatedSelectionState === getEditorState().getSelection()) {
            const blockMapKeys = getBlockMapKeys(
              getEditorState().getCurrentContent(),
              updatedSelectionState.getStartKey(),
              updatedSelectionState.getEndKey(),
            );
            if (
              blockMapKeys.some((key) => blockKeyStore.getAll().includes(key))
            ) {
              // todo
              setEditorState(
                EditorState.forceSelection(
                  getEditorState(),
                  getEditorState().getSelection(),
                ),
              );
            }
          }
        }
      }

      return false;
    },

    // Wrap all block-types in block-focus decorator
    blockRendererFn: (contentBlock, { getEditorState }) => {
      // This makes it mandatory to have atomic blocks for focus but also improves performance
      // since all the selection checks are not necessary.
      // In case there is a use-case where focus makes sense for none atomic blocks we can add it
      // in the future.
      console.log('focus plugin blockRendererFn run run run');
      if (
        contentBlock.getType() !== 'atomic'
        // 类似 undo 操作的时候，被恢复的 atomic block 被渲染出来时为 selected 状态，但是
        // 当前该 atomic block 的 key 还没有被添加到 blockKeyStore 内，会导致 blockRenderFn 内
        // isFocused 值的计算出现偏差，所以不能使用 blockKeyStore 来判断是否要传递 isFocused
        // || !blockKeyStore.includes(contentBlock.getKey())
      ) {
        return undefined;
      }

      const editorState = getEditorState();
      const selection = editorState.getSelection();
      const isFocused =
        !withMouseDown &&
        selection.getHasFocus() &&
        blockInSelection(editorState, contentBlock.getKey());

      return {
        props: {
          isFocused,
          // isCollapsedSelection: editorState.getSelection().isCollapsed(),
          setFocusToBlock: () => {
            setSelectionToAtomicBlock(contentBlock);
          },
        },
      };
    },

    decorator: createDecorator({ blockKeyStore, store }),
  };
};
