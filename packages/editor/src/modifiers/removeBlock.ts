import { Modifier, EditorState, SelectionState } from 'draft-js';

/* NOT USED at the moment, but might be valuable if we want to fix atomic block behaviour */

export default function (
  editorState: EditorState,
  blockKey: string,
): EditorState {
  let content = editorState.getCurrentContent();

  const beforeKey = content.getKeyBefore(blockKey);
  const beforeBlock = content.getBlockForKey(beforeKey);

  // 当 focusable 的 block 在 draft 开头处，删除之后保留 block ，类型 unstyled 且内容为空。
  if (beforeBlock === undefined) {
    const targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 1,
    });
    // change the blocktype and remove the characterList entry with the sticker
    content = Modifier.removeRange(content, targetRange, 'backward');
    content = Modifier.setBlockType(content, targetRange, 'unstyled');
    const newState = EditorState.push(editorState, content, 'remove-range');

    // force to new selection
    // todo: 是否应该在 content 的 selectionAfter & selectionBefore 中设置相应内容，而不是forceSelection?
    const newSelection = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 0,
    });
    return EditorState.forceSelection(newState, newSelection);
  }

  const targetRange = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),
    focusKey: blockKey,
    focusOffset: 1,
  });

  content = Modifier.removeRange(content, targetRange, 'backward');
  // todo: 是否应该在 content 的 selectionAfter & selectionBefore 中设置相应内容，而不是forceSelection?
  const newState = EditorState.push(editorState, content, 'remove-range');

  // force to new selection
  const newSelection = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),
    focusKey: beforeKey,
    focusOffset: beforeBlock.getLength(),
  });
  return EditorState.forceSelection(newState, newSelection);
}
