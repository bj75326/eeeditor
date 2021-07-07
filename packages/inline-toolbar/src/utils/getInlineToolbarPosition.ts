import { getVisibleSelectionRect } from '@eeeditor/editor';

export interface InlineToolbarPosition {
  top: number;
  left: number;
}

export const getInlineToolbarPosition = (
  editorRoot: HTMLElement,
  toolbarElement: HTMLElement,
): InlineToolbarPosition => {
  const editorRootRect = editorRoot.getBoundingClientRect();

  const parentWindow =
    editorRoot.ownerDocument && editorRoot.ownerDocument.defaultView;
  const targetRect = getVisibleSelectionRect(parentWindow || window);

  return {
    top:
      editorRoot.offsetTop +
      (targetRect.top - editorRootRect.top) -
      toolbarElement.offsetHeight -
      4,
    left:
      editorRoot.offsetLeft +
      (targetRect.left - editorRootRect.left) +
      targetRect.width / 2 -
      toolbarElement.offsetWidth / 2,
  };
};

export default getInlineToolbarPosition;
