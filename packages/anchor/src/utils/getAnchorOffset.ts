import { EditorState } from '@eeeditor/editor';

export type AnchorOffset = {
  startKey: string;
  startOffset: number;
  endKey: string;
  endOffset: number;
};

export const getAnchorOffset = (
  editorState: EditorState,
  entityKey: string,
  offsetKey: string,
) => {
  const blockKey = offsetKey.split('-')[0];
  const contentBlock = editorState.getCurrentContent().getBlockForKey(blockKey);
  contentBlock.findEntityRanges(
    (character) => {
      const charEntityKey = character.getEntity();
      return false;
    },
    (start, end) => {},
  );
};

export default getAnchorOffset;
