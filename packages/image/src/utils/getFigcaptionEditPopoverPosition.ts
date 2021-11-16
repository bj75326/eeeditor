export interface PopoverPosition {
  top: number;
  left: number;
}

export const getFigcaptionEditPopoverPosition = (
  editorRoot: HTMLElement,
  popoverElement: HTMLElement,
  target: HTMLElement,
) => {
  const editorRootRect = editorRoot.getBoundingClientRect();

  const targetRect = target.getBoundingClientRect();

  return {
    top: editorRoot.offsetTop + targetRect.top - editorRootRect.top,
    left:
      editorRoot.offsetLeft +
      targetRect.left -
      editorRootRect.left +
      targetRect.width / 2 -
      popoverElement.offsetWidth / 2,
  };
};

export default getFigcaptionEditPopoverPosition;
