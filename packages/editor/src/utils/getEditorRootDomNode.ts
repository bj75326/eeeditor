import { EditorRef } from '..';

export const getEditorRootDomNode = (editorRef: EditorRef): HTMLElement => {
  let editorRoot = editorRef.editor;

  if (!editorRoot) {
    return null;
  }

  while (editorRoot.className.indexOf('DraftEditor-root') === -1) {
    editorRoot = editorRoot.parentNode as HTMLElement;
  }

  return editorRoot;
};

export default getEditorRootDomNode;
