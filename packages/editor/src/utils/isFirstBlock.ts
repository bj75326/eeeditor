import { ContentState } from '..';

export const isFirstBlock = (
  blockKey: string,
  contentState: ContentState,
): boolean => !!!contentState.getBlockBefore(blockKey);
