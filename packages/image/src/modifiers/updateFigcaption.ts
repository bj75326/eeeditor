import { EditorState, Modifier, ContentState } from '@eeeditor/editor';
import Immutable from 'immutable';

const updateFigcaption = (
  editorState: EditorState,
  figcaption: string,
): EditorState => {
  const afterMergeBlockData = Modifier.mergeBlockData(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    Immutable.Map<string, string>({
      figcaption,
    }),
  );

  const withBlured = afterMergeBlockData.set(
    'selectionAfter',
    afterMergeBlockData.getSelectionAfter().set('hasFocus', false),
  ) as ContentState;

  return EditorState.push(
    editorState,
    // Modifier.mergeBlockData(
    //   editorState.getCurrentContent(),
    //   editorState.getSelection(),
    //   Immutable.Map<string, string>({
    //     figcaption,
    //   }),
    // ),
    withBlured,
    // afterMergeBlockData,
    'change-block-data',
  );
};

export default updateFigcaption;
