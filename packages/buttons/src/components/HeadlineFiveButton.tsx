import createBlockStyleButton from '../utils/createBlockStyleButton';
import { RichUtils, Modifier, EditorState } from '@eeeditor/editor';

const defaultHeadlineFiveIcon = (
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
      d="M24 8V40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M7 24H23"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M40 21.0093H32V28.0341C32 28 34 27 37 27C40 27 41 29.5339 41 33.5C41 37.4661 40 40 36 40C33 40 32 38 32 36.0078"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createBlockStyleButton({
  blockType: 'header-five',
  buttonType: 'header',
  children: defaultHeadlineFiveIcon,
  defaultTitle: {
    name: 'eeeditor.button.h5.tip.name',
    shortcut: 'eeeditor.button.h5.tip.shortcut',
  },
  buttonBeforeInputHandler(chars, editorState, _, { setEditorState }) {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const strBefore = contentState
      .getBlockForKey(selection.getStartKey())
      .getText()
      .slice(0, selection.getStartOffset());

    if (`${strBefore}${chars}` === '##### ' && selection.isCollapsed()) {
      const newContentState = Modifier.removeRange(
        RichUtils.toggleBlockType(
          editorState,
          'header-five',
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
