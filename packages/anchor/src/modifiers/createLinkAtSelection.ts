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

    // const withLink = newEditorState.getCurrentContent();

    // eeeditor 所有的操作过程中如果使 editor 失去焦点，那么在最后 push editorState 之前，
    // 务必确保焦点返还给 editor，以使 selectionBefore 数值正常
    // 所以没有必要在这里校正 selection
    // const withLinkRevisedSelection = withLink.merge({
    //   selectionAfter: withLink.getSelectionAfter().merge({
    //     hasFocus: true,
    //   }),
    // });

    // return EditorState.push(
    //   editorState,
    //   withLinkRevisedSelection as ContentState,
    //   'apply-entity',
    // );
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
