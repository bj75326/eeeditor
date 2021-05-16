import { ContentBlock, ContentState } from '@eeeditor/editor';

const matchesEntityType = (type: string): boolean => type === 'Link';

const strategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState,
): void => {
  if (!contentState) return;

  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      matchesEntityType(contentState.getEntity(entityKey).getType())
    );
  }, callback);
};

export default strategy;
