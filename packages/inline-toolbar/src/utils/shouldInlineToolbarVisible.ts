import { SelectionState } from '@eeeditor/editor';

export const shouldInlineToolbarVisible = (
  selection: SelectionState,
): boolean => selection && !selection.isCollapsed() && selection.getHasFocus();

export default shouldInlineToolbarVisible;
