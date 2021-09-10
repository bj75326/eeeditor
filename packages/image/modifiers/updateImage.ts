import { EditorState } from '@eeeditor/editor';
import { ImageEntityData, ImagePluginStore } from '..';

const updateImage =
  (store: ImagePluginStore) =>
  (editorState: EditorState, data: ImageEntityData): EditorState => {
    const contentState = editorState.getCurrentContent();

    const { uid } = data;

    const entityKey = store.getItem('entityKeyMap')[uid];

    if (!entityKey)
      throw new Error(
        `updateImage get entityKey failed which correspond to uid ${uid}`,
      );

    contentState.mergeEntityData(entityKey, data);

    // todo
    return;
  };

export default updateImage;
