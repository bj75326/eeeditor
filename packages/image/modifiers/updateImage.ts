import { EditorState } from '@eeeditor/editor';
import { ImageEntityData } from '..';

const updateImage = (
  editorState: EditorState,
  data: ImageEntityData,
): EditorState => {
  const contentState = editorState.getCurrentContent();
  // getImageEntityKey 获取 entityKey

  // todo entity 的改动是否 immutable
  return;
};

export default updateImage;
