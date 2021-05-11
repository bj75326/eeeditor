import { SelectionState, EditorState } from 'draft-js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import { KeyboardEvent } from 'react';

// Set selection of editor to next/previous block
export default (
  getEditorState: () => EditorState,
  setEditorState: (state: EditorState) => void,
  mode: string,
  event: KeyboardEvent,
): void => {
  const editorState = getEditorState();
  const selectionKey =
    mode === 'up'
      ? editorState.getSelection().getStartKey()
      : editorState.getSelection().getEndKey();
  const newActiveBlock =
    mode === 'up'
      ? editorState.getCurrentContent().getBlockBefore(selectionKey)
      : editorState.getCurrentContent().getBlockAfter(selectionKey);

  if (newActiveBlock && newActiveBlock.get('key') === selectionKey) {
    return;
  }

  if (newActiveBlock) {
    // 类似这种通过 EditorState.forceSelection 触发的重新渲染， DraftEditorLeaf level 都会根据
    // 自上而下传递的 selectionState 重新计算 native selection 的位置，因此在这里不需要手动计算
    // native selection
    // // TODO verify that always a key-0-0 exists
    // const offsetKey = DraftOffsetKey.encode(newActiveBlock.getKey(), 0, 0);
    // const node = document.querySelectorAll(
    //   `[data-offset-key="${offsetKey}"]`,
    // )[0];
    // // set the native selection to the node so the caret is not in the text and
    // // the selectionState matches the native selection
    // const selection = window.getSelection()!;
    // const range = document.createRange();
    // range.setStart(node, 0);
    // range.setEnd(node, 0);
    // selection.removeAllRanges();
    // selection.addRange(range);

    const offset = mode === 'up' ? newActiveBlock.getLength() : 0;
    event.preventDefault();
    setEditorState(
      EditorState.forceSelection(
        editorState,
        new SelectionState({
          anchorKey: newActiveBlock.getKey(),
          anchorOffset: offset,
          focusKey: newActiveBlock.getKey(),
          focusOffset: offset,
          isBackward: false,
        }),
      ),
    );
  }
};
