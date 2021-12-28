import { EditorState, Modifier } from '@eeeditor/editor';
import Immutable from 'immutable';

const updateBlockData = (
  editorState: EditorState,
  data: object,
): EditorState => {
  const afterMergeBlockData = Modifier.mergeBlockData(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    Immutable.Map<string, string>(data),
  );

  return EditorState.push(
    editorState,
    afterMergeBlockData,
    'change-block-data',
  );
};

export default updateBlockData;
