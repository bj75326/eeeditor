import { EditorState } from '@eeeditor/editor';

export const shouldSideToolbarVisible = (editorState: EditorState): boolean => {
  const selection = editorState.getSelection();
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(selection.getStartKey());

  return (
    selection &&
    selection.isCollapsed() &&
    selection.getHasFocus() &&
    (block.getType() === 'unstyled' || block.getType() === 'paragraph') &&
    block.getLength() === 0
  );
};

export default shouldSideToolbarVisible;
