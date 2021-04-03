import createToggleInlineStyleButton from '../utils/createToggleInlineStyleButton';
import { RichUtils } from '@eeeditor/editor';

export const defaultItalicIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 6H36"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M12 42H28"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M29 5.95239L19 42"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createToggleInlineStyleButton({
  inlineStyle: 'ITALIC',
  buttonType: 'italic',
  defaultChildren: defaultItalicIcon,
  defaultTitle: {
    name: 'eeeditor.button.italic.tip.name',
    shortcut: 'eeeditor.button.italic.tip.shortcut',
  },
  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'italic') {
      setEditorState(RichUtils.handleKeyCommand(editorState, 'italic'));
      return 'handled';
    }
    return 'not-handled';
  },
});
