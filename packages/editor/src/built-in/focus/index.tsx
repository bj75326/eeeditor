import {
  EditorState,
  SelectionState,
  ContentState,
  EditorPlugin,
  getRangeCoords,
  getSelectionCoords,
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
// import removeBlock from '../../modifiers/removeBlock';

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

// const deleteCommands = [
//   'backspace',
//   'backspace-word',
//   'backspace-to-start-of-line',
//   'delete',
//   'delete-word',
//   'delete-to-end-of-block',
// ];

export { BlockFocusDecoratorProps };

export interface FocusEditorPluginConfig {}

type FocusEditorPlugin = EditorPlugin & {
  decorator: ReturnType<typeof createDecorator>;
};

export default (config: FocusEditorPluginConfig = {}): FocusEditorPlugin => {
  const blockKeyStore = createBlockKeyStore();
  let lastSelection: SelectionState | undefined;
  let lastContentState: ContentState | undefined;

  return {
    handleReturn: (event, editorState, { setEditorState }) => {
      console.log('focus plugin handle return run run run');
      // 如果当前有且仅有 focusable block 被选中：
      // 按下 Return 则会在 focusable block 前插入一个新的 text block
      if (focusableBlockIsSelected(editorState, blockKeyStore)) {
        setEditorState(insertNewLineBefore(editorState));
        return 'handled';
      }
      // 如果当前 selectionState start block 为 focusable block ：
      // eeeditor foucsable block 的 setSelection 方法会在 focusable block 为 anchor
      // 或者 focus 节点的时候将 selection 限制在当前 block 内，因此这种情况暂时不考虑
      // 返回 'not-handled' 执行默认处理

      // 如果当前 selectionState end block 为 focusable block ：
      // 同上一种情况

      // 如果当前 selectionState 包含 focusable block ，但 start/end 不是 focusable block ：
      // 返回 'not-handled' 执行默认处理
      return 'not-handled';
    },

    // handleKeyCommand: (command, editorState, { setEditorState }) => {
    //   // 如果当前有且仅有 focusable block 被选中：
    //   // delete command
    //   if (
    //     deleteCommands.includes(command) &&
    //     focusableBlockIsSelected(editorState, blockKeyStore)
    //   ) {
    //     const key = editorState.getSelection().getStartKey();
    //     const newEditorState = removeBlock(editorState, key);
    //     if (newEditorState !== editorState) {
    //       setEditorState(newEditorState);
    //       return 'handled';
    //     }
    //   }

    //   // 如果当前 selectionState start block 为 focusable block ：
    //   // eeeditor foucsable block 的 setSelection 方法会在 focusable block 为 anchor
    //   // 或者 focus 节点的时候将 selection 限制在当前 block 内，因此这种情况暂时不考虑
    //   // 返回 'not-handled' 执行默认处理

    //   // 如果当前 selectionState end block 为 focusable block ：
    //   // 同上一种情况

    //   // 如果当前 selectionState 包含 focusable block ，但 start/end 不是 focusable block
    //   // 返回 'not-handled' 执行默认处理

    //   return 'not-handled';
    // },

    onChange: (editorState) => {
      // in case the content changed there is no need to re-render blockRendererFn
      // since if a block was added it will be rendered anyway and if it was text
      // then the change was not a pure selection change
      const contentState = editorState.getCurrentContent();
      if (!contentState.equals(lastContentState!)) {
        lastContentState = contentState;
        return editorState;
      }
      lastContentState = contentState;

      // if the selection didn't change there is no need to re-render
      const selection = editorState.getSelection();
      if (lastSelection && selection.equals(lastSelection)) {
        lastSelection = editorState.getSelection();
        return editorState;
      }

      // contentState 没有变化，但 selectionState 发生变化时，只有在 lastSelection 或者
      // 当前 selection 包含 focusable block 时，需要通过 forceSelection 重新触发 blockRendererFn
      const focusableBlockKeys = blockKeyStore.getAll();
      if (lastSelection) {
        const lastBlockMapKeys = getBlockMapKeys(
          contentState,
          lastSelection.getStartKey(),
          lastSelection.getEndKey(),
        );
        if (lastBlockMapKeys.some((key) => focusableBlockKeys.includes(key!))) {
          lastSelection = selection;
          // By forcing the selection the editor will trigger the blockRendererFn which is
          // necessary for the blockProps containing isFocus to be passed down again.
          return EditorState.forceSelection(
            editorState,
            editorState.getSelection(),
          );
        }
      }

      const currentBlockMapKeys = getBlockMapKeys(
        contentState,
        selection.getStartKey(),
        selection.getEndKey(),
      );
      if (
        currentBlockMapKeys.some((key) => focusableBlockKeys.includes(key!))
      ) {
        lastSelection = selection;
        // By forcing the selection the editor will trigger the blockRendererFn which is
        // necessary for the blockProps containing isFocus to be passed down again.
        return EditorState.forceSelection(
          editorState,
          editorState.getSelection(),
        );
      }

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

    // Wrap all block-types in block-focus decorator
    blockRendererFn: (contentBlock, { getEditorState, setEditorState }) => {
      // This makes it mandatory to have atomic blocks for focus but also improves performance
      // since all the selection checks are not necessary.
      // In case there is a use-case where focus makes sense for none atomic blocks we can add it
      // in the future.
      console.log('focus plugin blockRendererFn run!!!!');
      if (contentBlock.getType() !== 'atomic') {
        return undefined;
      }

      const editorState = getEditorState();
      const isFocused = blockInSelection(editorState, contentBlock.getKey());

      return {
        props: {
          isFocused,
          isCollapsedSelection: editorState.getSelection().isCollapsed(),
          // setFocusToBlock: () => {
          //   setSelectionToBlock(getEditorState, setEditorState, contentBlock);
          // },
        },
      };
    },

    decorator: createDecorator({ blockKeyStore }),
  };
};
