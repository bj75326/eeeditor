import { EditorState } from '@eeeditor/editor';

const updateImage = (
  editorState: EditorState,
  entityKey: string,
  data: Record<string, unknown>,
): EditorState => {
  const contentState = editorState.getCurrentContent();
  const newContentState = contentState.mergeEntityData(entityKey, data);
  // todo entity 的改动是否 immutable
  return;
};

export default updateImage;
