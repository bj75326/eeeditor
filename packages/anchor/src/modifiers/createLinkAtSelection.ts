import {
  EditorState,
  RichUtils,
  Modifier,
  DraftInlineStyle,
  getSelectedText,
} from '@eeeditor/editor';
import { LinkEntityData } from '..';

const createLinkAtSelection = (
  editorState: EditorState,
  data: LinkEntityData,
  text: string,
  inlineStyle?: DraftInlineStyle,
): EditorState => {
  const contentStateWithEntity = editorState
    .getCurrentContent()
    .createEntity('LINK', 'MUTABLE', data);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  // 如果链接文本部分没有变化，则使用 RichUtils.toggleLink 保留原有的 inlineStyle
  if (getSelectedText(editorState) === text) {
    return RichUtils.toggleLink(
      editorState,
      editorState.getSelection(),
      entityKey,
    );
  }

  const withLink = Modifier.replaceText(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    text,
    inlineStyle,
    entityKey,
  );
  return EditorState.push(editorState, withLink, 'apply-entity');
  // return EditorState.forceSelection(withLink, editorState.getSelection());
};

export default createLinkAtSelection;
