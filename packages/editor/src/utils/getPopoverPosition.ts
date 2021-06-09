import { getVisibleSelectionRect } from 'draft-js';

export interface PopoverPosition {
  top: number;
  left: number;
}

export const getPopoverPosition = (
  editorRoot: HTMLElement,
  popoverElement: HTMLElement,
): PopoverPosition | null => {
  const editorRootRect = editorRoot.getBoundingClientRect();

  const parentWindow =
    editorRoot.ownerDocument && editorRoot.ownerDocument.defaultView;

  const selectionRect = getVisibleSelectionRect(parentWindow || window);

  if (!selectionRect) return null;

  return {
    top:
      editorRoot.offsetTop +
      (selectionRect.top - editorRootRect.top) -
      popoverElement.offsetHeight -
      4,
    left:
      editorRoot.offsetLeft +
      (selectionRect.left - editorRootRect.left) +
      selectionRect.width / 2 -
      popoverElement.offsetWidth / 2,
  };
};

export default getPopoverPosition;
