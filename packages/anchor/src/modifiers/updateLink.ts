import {
  EditorState,
  Modifier,
  RichUtils,
  DraftInlineStyle,
  ContentState,
} from '@eeeditor/editor';
import { LinkEntityData } from '..';

const updateLink = (
  editorState: EditorState,
  link: string,
  text: string,
  initLink: string,
  initText: string,
  inlineStyle?: DraftInlineStyle,
): EditorState => {
  if (!link) return;

  if (!text) text = link;

  if (link === initLink && text === initText) return;

  if (link !== initLink) {
    const data: LinkEntityData = { url: link };

    const contentStateWithEntity = editorState
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', data);
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    if (text === initText) {
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
  }

  if (link === initLink && text !== initText) {
    const withTextReplaced = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      text,
      inlineStyle,
    );

    const withTextReplacedRevisedSelection = withTextReplaced.merge({
      selectionAfter: withTextReplaced.getSelectionAfter().merge({
        anchorOffset:
          withTextReplaced.getSelectionAfter().getAnchorOffset() - text.length,
        isBackward: false,
      }),
    });

    return EditorState.push(
      editorState,
      withTextReplacedRevisedSelection as ContentState,
      'apply-entity',
    );
  }
};

export default updateLink;
