import { EditorState } from 'draft-js';

export type DecoratedOffset = {
  startKey: string;
  startOffset: number;
  endKey: string;
  endOffset: number;
};

export const getDecoratedLeavesOffset = (
  editorState: EditorState,
  entityKey: string,
  offsetKey: string,
  childrenStart: number,
): DecoratedOffset => {
  const blockKey = offsetKey.split('-')[0];
  const contentBlock = editorState.getCurrentContent().getBlockForKey(blockKey);
  const offset: DecoratedOffset = null;
  contentBlock.findEntityRanges(
    (character) => {
      const charEntityKey = character.getEntity();
      return charEntityKey === entityKey;
    },
    (start, end) => {
      if (start === childrenStart) {
        offset.startKey = blockKey;
        offset.startOffset = start;
        offset.endKey = blockKey;
        offset.endOffset = end;
      }
    },
  );
  return offset;
};

export default getDecoratedLeavesOffset;
