import { EditorState, insertAtomicBlockWithoutSplit } from '@eeeditor/editor';

const addDivider = (entityType: string) => (
  editorState: EditorState,
  data?: Record<string, unknown>,
): EditorState => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    entityType,
    'IMMUTABLE',
    data,
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = insertAtomicBlockWithoutSplit(
    editorState,
    entityKey,
    ' ',
  );

  // return EditorState.forceSelection(
  //   newEditorState,
  //   newEditorState.getCurrentContent().getSelectionAfter(),
  // );
  return newEditorState;
};

export default addDivider;
