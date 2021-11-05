import { EditorState, Modifier } from '@eeeditor/editor';
import Immutable from 'immutable';

const updateFigcaption = (
  editorState: EditorState,
  figcaption: string,
): EditorState => {
  return EditorState.push(
    editorState,
    Modifier.mergeBlockData(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      Immutable.Map<string, string>({
        figcaption,
      }),
    ),
    'change-block-data',
  );
};

export default updateFigcaption;
