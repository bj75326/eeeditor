import { EditorState, insertAtomicBlockWithoutSplit } from '@eeeditor/editor';
import { ImageEntityData, ImagePluginStore } from '..';

const addImage =
  (entityType: string, store: ImagePluginStore) =>
  (editorState: EditorState, data: ImageEntityData): EditorState => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      entityType,
      'IMMUTABLE',
      data,
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const { uid } = data;

    const newEntityKeyMap = {
      ...store.getItem('entityKeyMap'),
      [uid]: entityKey,
    };
    store.updateItem('entityKeyMap', newEntityKeyMap);

    const newEditorState = insertAtomicBlockWithoutSplit(
      editorState,
      entityKey,
      ' ',
    );

    return newEditorState;
  };

export default addImage;
