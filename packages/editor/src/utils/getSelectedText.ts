import { EditorState } from 'draft-js';

export const getSelectedText = (editorState: EditorState): string => {
  const selection = editorState.getSelection();
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  // getSelectedText 只考虑 selection 在一个 ContentBlock 内
  if (startKey !== endKey) return;

  const contentBlock = editorState.getCurrentContent().getBlockForKey(startKey);
  // block type 为 'atomic' 或 'code-block' 时
  const blockType = contentBlock.getType();
  if (blockType === 'atomic' || blockType === 'code-block') return;

  return contentBlock
    .getText()
    .slice(selection.getStartOffset(), selection.getEndOffset());
};

export default getSelectedText;
