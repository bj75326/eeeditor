import createSetBlockDataButton from '../utils/createSetBlockDataButton';
import { KeyCommand } from '..';
import { KeyBindingUtil, EditorState, Modifier } from '@eeeditor/editor';
import Immutable from 'immutable';

export const defaultAlignRightIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" fill="white" fillOpacity="0.01" />
    <path
      d="M42 9H6"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M42 19H14"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M42 29H6"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M42 39H14"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createSetBlockDataButton<KeyCommand | false, false>({
  blockMetaData: {
    align: 'right',
  },
  buttonType: 'align',
  defaultChildren: defaultAlignRightIcon,
  defaultTitle: {
    name: 'eeeditor.button.align.right.tip.name',
  },
  defaultKeyCommand: {
    keyCode: 82,
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
      return 'align-right';
    }
    return undefined;
  },
  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'align-right') {
      setEditorState(
        EditorState.push(
          editorState,
          Modifier.mergeBlockData(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            Immutable.Map<string, string | boolean | number>({
              align: 'right',
            }),
          ),
          'change-block-data',
        ),
      );
      return 'handled';
    }
    return 'not-handled';
  },
});
