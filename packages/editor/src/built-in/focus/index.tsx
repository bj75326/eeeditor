import { EditorState } from '../..';
import createBlockKeyStore, {
  BlockKeyStore,
} from './utils/createBlockKeyStore';

const focusableBlockIsSelected = (
  editorState: EditorState,
  blockKeyStore: BlockKeyStore,
): boolean => {
  const selection = editorState.getSelection();
  return false;
};
