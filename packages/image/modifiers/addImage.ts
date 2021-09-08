// import { EditorState, AtomicBlockUtils } from 'draft-js';

// export default (
//   editorState: EditorState,
//   url: string,
//   extraData: Record<string, unknown>
// ): EditorState => {
//   const urlType = 'IMAGE';
//   const contentState = editorState.getCurrentContent();
//   const contentStateWithEntity = contentState.createEntity(
//     urlType,
//     'IMMUTABLE',
//     { ...extraData, src: url }
//   );
//   const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
//   const newEditorState = AtomicBlockUtils.insertAtomicBlock(
//     editorState,
//     entityKey,
//     ' '
//   );
//   return EditorState.forceSelection(
//     newEditorState,
//     newEditorState.getCurrentContent().getSelectionAfter()
//   );
// };

import { EditorState, insertAtomicBlockWithoutSplit } from '@eeeditor/editor';

const addImage =
  (entityType: string) =>
  (
    editorState: EditorState,
    url: string,
    extraData: Record<string, unknown> = { loading: true },
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
