import {
  EditorState,
  RichUtils,
  Modifier,
  DraftInlineStyle,
  getSelectedText,
  ContentState,
} from '@eeeditor/editor';
import { LinkEntityData } from '..';

const createLinkAtSelection = (
  editorState: EditorState,
  link: string,
  text: string,
  inlineStyle?: DraftInlineStyle,
): EditorState => {
  if (!link) return;

  if (!text) {
    text = link;
  }

  const data: LinkEntityData = { url: link };

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
  const withLinkRevisedSelection = withLink.merge({
    selectionAfter: withLink.getSelectionAfter().merge({
      anchorOffset:
        withLink.getSelectionAfter().getAnchorOffset() - text.length,
      isBackward: false,
    }),
  });

  return EditorState.push(
    editorState,
    withLinkRevisedSelection as ContentState,
    'apply-entity',
  );
};

export default createLinkAtSelection;
