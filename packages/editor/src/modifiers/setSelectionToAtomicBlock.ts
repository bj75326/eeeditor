// 类似 img 标签点击不能触发 onSelect 事件，所以使用 setSelectionToAtomicBlock 手动触发
// 1. 如果只使用原生 selection api 手动触发 selection，draft.js 内转成 selectionState 时可能会有bug，不可以！
// 2. 如果只使用 forceSelection 改变 selectionState，？
// 3. 如果 selectionState 与 原生 selection 同时设置，？

import { EditorState, ContentBlock, SelectionState } from 'draft-js';

export const setSelectionToAtomicBlock = (
  getEditorState: () => EditorState,
  setEditorState: (editorState: EditorState) => void,
  newActiveBlock: ContentBlock,
  // node: Node,
): void => {
  const editorState = getEditorState();

  // const selection = window.getSelection();
  // const range = document.createRange();
  // range.setStart(node, 0);
  // range.setEnd(node, 0);
  // selection.removeAllRanges();
  // selection.addRange(range);

  setEditorState(
    EditorState.forceSelection(
      editorState,
      new SelectionState({
        anchorKey: newActiveBlock.getKey(),
        anchorOffset: 0,
        focusKey: newActiveBlock.getKey(),
        focusOffset: 0,
        isBackward: false,
      }),
    ),
  );
};

export default setSelectionToAtomicBlock;
