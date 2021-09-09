import { EditorState } from '@eeeditor/editor';

const getImageEntityKey = (
  editorState: EditorState,
  uid: string,
): string | null => {
  const entityMap = editorState.getCurrentContent().getEntityMap();

  return;
};

export default getImageEntityKey;
