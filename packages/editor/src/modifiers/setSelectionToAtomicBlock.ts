// 类似 img 标签点击不能触发 onSelect 事件，所以使用 setSelectionToAtomicBlock 手动触发
// 1. 如果只使用原生 selection api 手动触发 selection ？
// 需要注意 draft.js getDraftEditorSelectionWithNodes 内，将原生 selection 转化为 selectionState 的结果
// 2. 如果只使用 forceSelection 改变 selectionState ？
// 类似 img 标签本身不支持 select 事件，点击 img 触发 draft editor 的 select 事件，所获取的原生 selection 数据是不准确的，pass!
// 3. 如果 selectionState 与 原生 selection 同时设置 ？
// 如果情况1，getDraftEditorSelectionWithNodes 转化得到的 selectionState 正常，就没有必要在 setSelectionToAtomicBlock 内
// forceSelection。

import { EditorState, ContentBlock, SelectionState } from 'draft-js';

export const setSelectionToAtomicBlock = (
  getEditorState: () => EditorState,
  setEditorState: (editorState: EditorState) => void,
  newActiveBlock: ContentBlock,
  node: Node,
): void => {
  // const editorState = getEditorState();

  const selection = window.getSelection();
  const range = document.createRange();
  range.setStart(node, 0);
  range.setEnd(node, 0);
  selection.removeAllRanges();
  selection.addRange(range);

  // setEditorState(
  //   EditorState.forceSelection(
  //     editorState,
  //     new SelectionState({
  //       anchorKey: newActiveBlock.getKey(),
  //       anchorOffset: 0,
  //       focusKey: newActiveBlock.getKey(),
  //       focusOffset: 0,
  //       isBackward: false,
  //     }),
  //   ),
  // );
};

export default setSelectionToAtomicBlock;
