import createToggleBlockTypeButton from '../utils/createToggleBlockTypeButton';
import {
  RichUtils,
  Modifier,
  EditorState,
  KeyCommand,
  checkKeyCommand,
} from '@eeeditor/editor';

export const defaultHeadlineTwoIcon = (
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
      d="M32 25C32 21.8334 34.6667 20 37 20C39.3334 20 42 21.8334 42 25C42 30.7 32 34.9333 32 40H42"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createToggleBlockTypeButton<KeyCommand | false, string | false>({
  blockType: 'header-two',
  buttonType: 'header',
  defaultChildren: defaultHeadlineTwoIcon,
  defaultTitle: {
    name: 'eeeditor.button.h2.tip.name',
    shortcut: 'eeeditor.button.h2.tip.shortcut',
  },
  defaultKeyCommand: false,
  defaultSyntax: '## ',
  // buttonBeforeInputHandler(chars, editorState, { setEditorState }) {
  //   const selection = editorState.getSelection();
  //   const contentState = editorState.getCurrentContent();
  //   const strBefore = contentState
  //     .getBlockForKey(selection.getStartKey())
  //     .getText()
  //     .slice(0, selection.getStartOffset());

  //   if (`${strBefore}${chars}` === '## ' && selection.isCollapsed()) {
  //     const newContentState = Modifier.removeRange(
  //       RichUtils.toggleBlockType(
  //         editorState,
  //         'header-two',
  //       ).getCurrentContent(),
  //       selection.merge({
  //         anchorOffset: 0,
  //         focusOffset: selection.getEndOffset(),
  //         isBackward: false,
  //       }),
  //       'backward',
  //     );
  //     setEditorState(
  //       EditorState.push(editorState, newContentState, 'change-block-type'),
  //     );
  //     return 'handled';
  //   }
  //   return 'not-handled';
  // },
  getKeyBindingFn: (keyCommand) => (event) => {
    if (keyCommand && checkKeyCommand(keyCommand, event)) {
      return 'header-two';
    }
    return undefined;
  },

  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'header-two') {
      setEditorState(RichUtils.toggleBlockType(editorState, 'header-two'));
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
          'header-two',
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
