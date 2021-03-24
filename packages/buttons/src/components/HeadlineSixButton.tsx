import createBlockStyleButton from '../utils/createBlockStyleButton';
import { RichUtils, Modifier, EditorState } from '@eeeditor/editor';

const defaultHeadlineSixIcon = (
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
      d="M36.5 40C39.5376 40 42 37.5376 42 34.5C42 31.4624 39.5376 29 36.5 29C33.4624 29 31 31.4624 31 34.5C31 37.5376 33.4624 40 36.5 40Z"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M41.5962 24.7392C40.7778 22.5461 38.8044 21 36.5 21C33.4624 21 31 23.6863 31 27V34"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createBlockStyleButton({
  blockType: 'header-six',
  buttonType: 'header',
  defaultChildren: defaultHeadlineSixIcon,
  defaultTitle: {
    name: 'eeeditor.button.h6.tip.name',
    shortcut: 'eeeditor.button.h6.tip.shortcut',
  },
  buttonBeforeInputHandler(chars, editorState, _, { setEditorState }) {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const strBefore = contentState
      .getBlockForKey(selection.getStartKey())
      .getText()
      .slice(0, selection.getStartOffset());

    if (`${strBefore}${chars}` === '###### ' && selection.isCollapsed()) {
      const newContentState = Modifier.removeRange(
        RichUtils.toggleBlockType(
          editorState,
          'header-six',
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
