import { getVisibleSelectionRect } from 'draft-js';

export interface PopoverPosition {
  top: number;
  left: number;
}

export const getPopoverPosition = (
  editorRoot: HTMLElement,
  popoverElement: HTMLElement,
  target?: HTMLElement,
): PopoverPosition | null => {
  const editorRootRect = editorRoot.getBoundingClientRect();

  let targetRect = null;
  if (target) {
    targetRect = target.getBoundingClientRect();
  } else {
    const parentWindow =
      editorRoot.ownerDocument && editorRoot.ownerDocument.defaultView;
    targetRect = getVisibleSelectionRect(parentWindow || window);
  }

  if (!targetRect) return null;

  return {
    top:
      editorRoot.offsetTop +
      (targetRect.top - editorRootRect.top) -
      popoverElement.offsetHeight -
      4,
    left:
      editorRoot.offsetLeft +
      (targetRect.left - editorRootRect.left) +
      targetRect.width / 2 -
      popoverElement.offsetWidth / 2,
  };
};

export default getPopoverPosition;
