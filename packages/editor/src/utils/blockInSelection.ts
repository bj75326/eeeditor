import { EditorState } from 'draft-js';
import { getSelectedBlocksMapKeys } from './getSelectedBlocksMapKeys';

export const blockInSelection = (
  editorState: EditorState,
  blockKey: string,
): boolean => {
  const selectedBlocksKeys = getSelectedBlocksMapKeys(editorState);
  return selectedBlocksKeys.includes(blockKey);
};
