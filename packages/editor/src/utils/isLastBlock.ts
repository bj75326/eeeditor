import { ContentState } from '..';

export const isLastBlock = (
  blockKey: string,
  contentState: ContentState,
): boolean => !!!contentState.getBlockAfter(blockKey);

export default isLastBlock;
