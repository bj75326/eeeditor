import createInlineStyleButton from '../utils/createInlineStyleButton';
import { RichUtils } from '@eeeditor/editor';

const defaultCodeIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" fill="white" fillOpacity="0.01" />
    <path
      d="M8 44H40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M37 6.09698C37 12.7636 37 15.3333 37 22C37 29.1797 31.1797 35 24 35C16.8203 35 11 29.1797 11 22C11 15.3333 11 12.7636 11 6.09698"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export default createInlineStyleButton({
  inlineStyle: 'UNDERLINE',
  buttonType: 'underline',
  children: defaultCodeIcon,
  defaultTitle: {
    name: 'eeeditor.button.underline.tip.name',
    shortcut: 'eeeditor.button.underline.tip.shortcut',
  },
  buttonKeyCommandHandler: (command, editorState, _, { setEditorState }) => {
    if (command === 'underline') {
      setEditorState(RichUtils.handleKeyCommand(editorState, 'underline'));
      return 'handled';
    }
    return 'not-handled';
  },
});
