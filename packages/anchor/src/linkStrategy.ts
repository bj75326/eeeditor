import { ContentBlock, ContentState } from '@eeeditor/editor';

export const matchesEntityType = (type: string): boolean => type === 'LINK';

const strategy = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState,
): void => {
  console.log('run link strategy!!!');
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
