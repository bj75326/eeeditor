import { EditorState } from '@eeeditor/editor';

export const getReferenceEl = (
  editorState: EditorState,
  editorRoot: HTMLElement,
): HTMLElement => {
  const block = editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey());
  const referenceEl = editorRoot.querySelector(
    `[data-offset-key="${block.getKey()}-0-0"][data-block="true"]`,
  );

  if (!referenceEl) return null;

  return referenceEl as HTMLElement;
};

export default getReferenceEl;
