import { EditorState, insertAtomicBlockWithoutSplit } from '@eeeditor/editor';
import { ImageEntityData, ImagePluginStore } from '..';
import { RcFile } from 'antd/lib/upload/interface';

const addImage =
  (entityType: string, store: ImagePluginStore) =>
  (
    editorState: EditorState,
    data: ImageEntityData,
    file: RcFile,
  ): EditorState => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      entityType,
      'IMMUTABLE',
      data,
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const uid = file.uid;

    const newEntityKeyMap = {
      ...store.getItem('entityKeyMap'),
      [uid]: entityKey,
    };
    store.updateItem('entityKeyMap', newEntityKeyMap);

    const newFileMap = {
      ...store.getItem('fileMap'),
      [entityKey]: file,
    };
    store.updateItem('fileMap', newFileMap);

    const newEditorState = insertAtomicBlockWithoutSplit(
      editorState,
      entityKey,
      ' ',
    );

    return newEditorState;
  };

export default addImage;
