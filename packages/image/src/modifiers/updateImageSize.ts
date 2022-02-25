import { EditorState, Modifier } from '@eeeditor/editor';
import Immutable from 'immutable';

const updateImageSize = (
  editorState: EditorState,
  width: number,
): EditorState => {
  const afterMergeBlockData = Modifier.mergeBlockData(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    Immutable.Map<string, number>({
      width,
    }),
  );

  return EditorState.push(
    editorState,
    afterMergeBlockData,
    'change-block-data',
  );
};

export default updateImageSize;
