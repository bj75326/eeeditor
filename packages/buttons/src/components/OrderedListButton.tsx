import createToggleBlockTypeButton from '../utils/createToggleBlockTypeButton';
import { RichUtils, Modifier, EditorState } from '@eeeditor/editor';

export const defaultOrderedListIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 4V13"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M12 13H6"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M12 27H6"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M6 19.9999C6 19.9999 9 16.9999 11 20C13 23 6 27 6 27"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M6.00001 34.5001C6.00001 34.5001 8.00001 31.5 11 33.5C14 35.5 11 38 11 38C11 38 14 40.5 11 42.5C8 44.5 6 41.5 6 41.5"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M11 38H9"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M9 4L6 6"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M21 24H43"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M21 38H43"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M21 10H43"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createToggleBlockTypeButton({
  blockType: 'ordered-list-item',
  buttonType: 'ordered-list-item',
  defaultChildren: defaultOrderedListIcon,
  defaultTitle: {
    name: 'eeeditor.button.ol.tip.name',
    shortcut: 'eeeditor.button.ol.tip.shortcut',
  },
  buttonBeforeInputHandler(chars, editorState, { setEditorState }) {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const strBefore = contentState
      .getBlockForKey(selection.getStartKey())
      .getText()
      .slice(0, selection.getStartOffset());

    if (`${strBefore}${chars}` === '1. ' && selection.isCollapsed()) {
      const newContentState = Modifier.removeRange(
        RichUtils.toggleBlockType(
          editorState,
          'ordered-list-item',
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