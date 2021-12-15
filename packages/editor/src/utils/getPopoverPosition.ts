import { getVisibleSelectionRect } from 'draft-js';

export interface PopoverPosition {
  top: number;
  left: number;
}

export const getPopoverPosition = (
  root: HTMLElement,
  popoverElement: HTMLElement,
  target?: HTMLElement,
  placement?: 'top' | 'bottom',
): PopoverPosition | null => {
  const rootRect = root.getBoundingClientRect();

  let targetRect = null;
  if (target) {
    targetRect = target.getBoundingClientRect();
  } else {
    const parentWindow = root.ownerDocument && root.ownerDocument.defaultView;
    targetRect = getVisibleSelectionRect(parentWindow || window);
  }

  if (!targetRect) return null;

  if (placement === 'bottom') {
    return {
      top: root.offsetTop + (targetRect.bottom - rootRect.top) + 4,
      left:
        root.offsetLeft +
        (targetRect.left - rootRect.left) +
        targetRect.width / 2 -
        popoverElement.offsetWidth / 2,
    };
  }

  return {
    top:
      root.offsetTop +
      (targetRect.top - rootRect.top) -
      popoverElement.offsetHeight -
      4,
    left:
      root.offsetLeft +
      (targetRect.left - rootRect.left) +
      targetRect.width / 2 -
      popoverElement.offsetWidth / 2,
  };
};

export default getPopoverPosition;
