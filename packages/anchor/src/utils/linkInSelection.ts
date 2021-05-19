import { ContentBlock, SelectionState, ContentState } from '@eeeditor/editor';
import { matchesEntityType } from '../linkStrategy';

const linkInSelection = (
  block: ContentBlock,
  selection: SelectionState,
  contentState: ContentState,
): boolean => {
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();

  if (
    selection.getStartKey() !== selection.getEndKey() ||
    selection.isCollapsed()
  ) {
    return false;
  }

  const linkRangeArray: Array<{ start: number; end: number }> = [];

  block.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        matchesEntityType(contentState.getEntity(entityKey).getType())
      );
    },
    (start: number, end: number) => {
      linkRangeArray.push({ start, end });
    },
  );

  return linkRangeArray.some(
    ({ start, end }) =>
      (start <= startOffset && end > startOffset) ||
      (start >= startOffset && end <= endOffset) ||
      (start < endOffset && end >= endOffset),
  );
};

export default linkInSelection;
