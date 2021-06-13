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
    const newEditorState = RichUtils.toggleLink(
      editorState,
      editorState.getSelection(),
      entityKey,
    );

    const withLink = newEditorState.getCurrentContent();
    console.log(
      'withLink.getSelectionBefore() ',
      withLink.getSelectionBefore(),
    );
    const withLinkRevisedSelection = withLink.merge({
      selectionBefore: withLink.getSelectionBefore().merge({
        hasFocus: true,
      }),
      selectionAfter: withLink.getSelectionAfter().merge({
        hasFocus: true,
      }),
    });
    console.log(
      'withLinkRevisedSelection.getSelectionBefore() ',
      (withLinkRevisedSelection as ContentState).getSelectionBefore(),
    );
    return EditorState.push(
      editorState,
      withLinkRevisedSelection as ContentState,
      'apply-entity',
    );
    // 通过 forceSelection 将 selectionAfter 应用到 editor component 上
    // return EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter().merge({
    //   hasFocus: true,
    // }));
  }

  const withLink = Modifier.replaceText(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    text,
    inlineStyle,
    entityKey,
  );
  const withLinkRevisedSelection = withLink.merge({
    selectionBefore: withLink.getSelectionBefore().merge({
      hasFocus: true,
    }),
    selectionAfter: withLink.getSelectionAfter().merge({
      anchorOffset:
        withLink.getSelectionAfter().getAnchorOffset() - text.length,
      isBackward: false,
      hasFocus: true,
    }),
  });

  return EditorState.push(
    editorState,
    withLinkRevisedSelection as ContentState,
    'apply-entity',
  );
  // 通过 forceSelection 将 selectionAfter 应用到 editor component 上
  // const selectionAfter = withLink.getSelectionAfter();
  // return EditorState.forceSelection(newEditorState, selectionAfter.merge({
  //   anchorOffset: selectionAfter.getAnchorOffset() - text.length,
  //   isBackward: false,
  //   hasFocus: true,
  // }));
};

export default createLinkAtSelection;
