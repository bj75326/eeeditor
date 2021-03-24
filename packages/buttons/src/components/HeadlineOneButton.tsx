import createBlockStyleButton from '../utils/createBlockStyleButton';
import { RichUtils, Modifier, EditorState } from '@eeeditor/editor';

const defaultHeadlineOneIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 8V40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M25 8V40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M6 24H25"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M34.2261 24L39.0001 19.0166V40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createBlockStyleButton({
  blockType: 'header-one',
  buttonType: 'header',
  defaultChildren: defaultHeadlineOneIcon,
  defaultTitle: {
    name: 'eeeditor.button.h1.tip.name',
    shortcut: 'eeeditor.button.h1.tip.shortcut',
  },
  buttonBeforeInputHandler(chars, editorState, _, { setEditorState }) {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const strBefore = contentState
      .getBlockForKey(selection.getStartKey())
      .getText()
      .slice(0, selection.getStartOffset());
    // 不考虑 selection anchor & focus offset是否相同
    // if (`${strBefore}${chars}` === '# ') {
    //   const newContentState = Modifier.replaceText(
    //     contentState,
    //     selection.merge({
    //       anchorOffset: 0,
    //       focusOffset: selection.getEndOffset(),
    //       isBackward: false,
    //     }),
    //     '',
    //   );
    //   setEditorState(RichUtils.toggleBlockType(EditorState.push(editorState, newContentState, 'remove-range'), 'header-one'));
    //   return 'handled';
    // }

    // 默认只有在 selection anchor & focus offset 相同的情况下，依次输入 '#'，' ' 才会通过 shortcut toggle block type
    if (`${strBefore}${chars}` === '# ' && selection.isCollapsed()) {
      const newContentState = Modifier.removeRange(
        RichUtils.toggleBlockType(
          editorState,
          'header-one',
        ).getCurrentContent(),
        selection.merge({
          anchorOffset: 0,
          focusOffset: selection.getEndOffset(),
          isBackward: false,
        }),
        'backward',
      );
      setEditorState(
        EditorState.push(editorState, newContentState, 'change-block-type'),
      );
      return 'handled';
    }
    return 'not-handled';
  },
});
