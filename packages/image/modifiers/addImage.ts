import { EditorState, insertAtomicBlockWithoutSplit } from '@eeeditor/editor';
import { ImageEntityData } from '..';

const addImage =
  (entityType: string) =>
  (editorState: EditorState, data: ImageEntityData): EditorState => {
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

    return newEditorState;
  };

export default addImage;
