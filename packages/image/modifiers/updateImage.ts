import { EditorState } from '@eeeditor/editor';
import { ImageEntityData } from '..';

const updateImage = (
  editorState: EditorState,
  entityKey: string,
  data: ImageEntityData,
): EditorState => {
  const contentState = editorState.getCurrentContent();
  const newContentState = contentState.mergeEntityData(entityKey, data);
  // todo entity 的改动是否 immutable
  return;
};

export default updateImage;
