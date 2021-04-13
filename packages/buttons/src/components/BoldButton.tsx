import createToggleInlineStyleButton from '../utils/createToggleInlineStyleButton';
import { RichUtils, KeyBindingUtil } from '@eeeditor/editor';
import { KeyCommand } from '..';

export const defaultBoldIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 24C29.5056 24 33.9688 19.5228 33.9688 14C33.9688 8.47715 29.5056 4 24 4H11V24H24Z"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28.0312 44C33.5368 44 38 39.5228 38 34C38 28.4772 33.5368 24 28.0312 24H11V44H28.0312Z"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createToggleInlineStyleButton<KeyCommand | false, false>({
  inlineStyle: 'BOLD',
  buttonType: 'bold',
  defaultChildren: defaultBoldIcon,
  defaultTitle: {
    name: 'eeeditor.button.bold.tip.name',
    shortcut: 'eeeditor.button.bold.tip.shortcut',
  },
  defaultKeyCommand: {
    keyCode: 66,
    hasCommandModifier: true,
  },
  defaultSyntax: false,
  getKeyBindingFn: (keyCommand: KeyCommand) => (event) => {
    if (
      keyCommand.keyCode === event.keyCode &&
      (keyCommand.isShiftKeyCommand === undefined ||
        keyCommand.isShiftKeyCommand === event.shiftKey) &&
      (keyCommand.isCtrlKeyCommand === undefined ||
        keyCommand.isCtrlKeyCommand ===
          KeyBindingUtil.isCtrlKeyCommand(event)) &&
      (keyCommand.isOptionKeyCommand === undefined ||
        keyCommand.isOptionKeyCommand ===
          KeyBindingUtil.isOptionKeyCommand(event)) &&
      (keyCommand.hasCommandModifier === undefined ||
        keyCommand.hasCommandModifier ===
          KeyBindingUtil.hasCommandModifier(event))
    ) {
      return 'bold';
    }
    return undefined;
  },
  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'bold') {
      setEditorState(RichUtils.handleKeyCommand(editorState, 'bold'));
      return 'handled';
    }
    return 'not-handled';
  },
});
