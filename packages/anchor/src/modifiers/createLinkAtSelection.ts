import { EditorState, RichUtils } from '@eeeditor/editor';
import { LinkEntityData } from '..';

const createLinkAtSelection = (
  editorState: EditorState,
  data: LinkEntityData,
): EditorState => {
  const contentStateWithEntity = editorState
    .getCurrentContent()
    .createEntity('LINK', 'MUTABLE', data);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  return RichUtils.toggleLink(
    editorState,
    editorState.getSelection(),
    entityKey,
  );
  //return EditorState.forceSelection(withLink, editorState.getSelection());
};

export default createLinkAtSelection;
