import { EditorState } from '..';
import { Map, is } from 'immutable';

export const isOnlyFocusChanged = (
  nextEditorState: EditorState,
  currEditorState: EditorState,
): boolean => {
  if (nextEditorState === currEditorState) return false;

  if (
    nextEditorState.getAllowUndo() !== currEditorState.getAllowUndo() ||
    nextEditorState.getCurrentContent() !==
      currEditorState.getCurrentContent() ||
    nextEditorState.getDecorator() !== currEditorState.getDecorator() ||
    nextEditorState.getDirectionMap() !== currEditorState.getDirectionMap() ||
    nextEditorState.mustForceSelection() !==
      currEditorState.mustForceSelection() ||
    nextEditorState.isInCompositionMode() !==
      currEditorState.isInCompositionMode() ||
    nextEditorState.getInlineStyleOverride() !==
      currEditorState.getInlineStyleOverride() ||
    nextEditorState.getLastChangeType() !==
      currEditorState.getLastChangeType() ||
    nextEditorState.getNativelyRenderedContent() !==
      currEditorState.getNativelyRenderedContent() ||
    nextEditorState.getRedoStack() !== currEditorState.getRedoStack() ||
    nextEditorState.getUndoStack() !== currEditorState.getUndoStack()
  ) {
    return false;
  }

  const nextSelection = nextEditorState.getSelection();
  const currSelection = currEditorState.getSelection();

  if (
    nextSelection.getAnchorKey() === currSelection.getAnchorKey() &&
    nextSelection.getAnchorOffset() === currSelection.getAnchorOffset() &&
    nextSelection.getFocusKey() === currSelection.getFocusKey() &&
    nextSelection.getFocusOffset() === currSelection.getFocusOffset() &&
    nextSelection.getIsBackward() === currSelection.getIsBackward() &&
    nextSelection.getHasFocus() !== currSelection.getHasFocus()
  ) {
    return true;
  }

  return false;
};

export default isOnlyFocusChanged;
