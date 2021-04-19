import createToggleBlockTypeButton from '../utils/createToggleBlockTypeButton';
import {
  RichUtils,
  Modifier,
  EditorState,
  KeyCommand,
  checkKeyCommand,
} from '@eeeditor/editor';

export const defaultHeadlineFourIcon = (
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
      d="M39.9767 40V20L31 32.9967V35.0199H43"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createToggleBlockTypeButton<KeyCommand | false, string | false>({
  blockType: 'header-four',
  buttonType: 'header',
  defaultChildren: defaultHeadlineFourIcon,
  defaultTitle: {
    name: 'eeeditor.button.h4.tip.name',
    shortcut: 'eeeditor.button.h4.tip.shortcut',
  },
  defaultKeyCommand: false,
  defaultSyntax: '#### ',

  getKeyBindingFn: (keyCommand) => (event) => {
    if (keyCommand && checkKeyCommand(keyCommand, event)) {
      return 'header-four';
    }
    return undefined;
  },

  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'header-four') {
      setEditorState(RichUtils.toggleBlockType(editorState, 'header-four'));
      return 'handled';
    }
    return 'not-handled';
  },
  getBeforeInputHandler: (syntax: string) => (
    chars,
    editorState,
    { setEditorState },
  ) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const strBefore = contentState
      .getBlockForKey(selection.getStartKey())
      .getText()
      .slice(0, selection.getStartOffset());

    if (`${strBefore}${chars}` === syntax && selection.isCollapsed()) {
      const newContentState = Modifier.removeRange(
        RichUtils.toggleBlockType(
          editorState,
          'header-four',
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
