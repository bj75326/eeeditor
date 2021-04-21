import { EditorState, AtomicBlockUtils } from '@eeeditor/editor';

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
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
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
