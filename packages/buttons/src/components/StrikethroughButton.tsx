import createToggleInlineStyleButton from '../utils/createToggleInlineStyleButton';
import { KeyCommand, checkKeyCommand, RichUtils } from '@eeeditor/editor';

export const defaultStrikethroughIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 24H43"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M24 24C40 30 34 44 24 44C13.9999 44 12 36 12 36"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M35.9999 12C35.9999 12 33 4 23.9999 4C14.9999 4 11.4359 11.5995 15.6096 18"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M12 36C12 36 15.9999 44 24 44C32 44 36.564 36.4005 32.3903 30"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createToggleInlineStyleButton<KeyCommand | false, false>({
  inlineStyle: 'STRIKETHROUGH',
  buttonType: 'strikethrough',
  defaultChildren: defaultStrikethroughIcon,
  defaultTitle: {
    name: 'eeeditor.button.strikethrough.tip.name',
    shortcut: 'eeeditor.button.strikethrough.tip.shortcut',
  },
  defaultKeyCommand: {
    keyCode: 83,
    isShiftKeyCommand: true,
    hasCommandModifier: true,
  },
  defaultSyntax: false,

  getKeyBindingFn: (keyCommand) => (event) => {
    if (keyCommand && checkKeyCommand(keyCommand, event)) {
      return 'strikethrough';
    }
    return undefined;
  },

  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'strikethrough') {
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH'));
      return 'handled';
    }
    return 'not-handled';
  },
});
