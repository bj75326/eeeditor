import { EditorState, insertAtomicBlockWithoutSplit } from '@eeeditor/editor';

const addImage =
  (entityType: string) =>
  (
    editorState: EditorState,
    url: string,
    extraData: Record<string, unknown> = { upload: true, status },
  ): { editorState: EditorState; entityKey: string } => {
    const data = {
      ...extraData,
      src: url,
    };

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

    return {
      editorState: newEditorState,
      entityKey,
    };
  };

export default addImage;
