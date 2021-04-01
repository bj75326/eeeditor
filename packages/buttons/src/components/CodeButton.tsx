import createToggleInlineStyleButton from '../utils/createToggleInlineStyleButton';
import { RichUtils } from '@eeeditor/editor';

const defaultCodeIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 13L4 25.4322L16 37"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M32 13L44 25.4322L32 37"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M28 4L21 44"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export default createToggleInlineStyleButton({
  inlineStyle: 'CODE',
  buttonType: 'code',
  defaultChildren: defaultCodeIcon,
  defaultTitle: {
    name: 'eeeditor.button.code.tip.name',
  },
  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'code') {
      setEditorState(RichUtils.handleKeyCommand(editorState, 'code'));
      return 'handled';
    }
    return 'not-handled';
  },
});
