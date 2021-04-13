import createSetBlockDataButton from '../utils/createSetBlockDataButton';
import { KeyCommand } from '..';
import { KeyBindingUtil, EditorState, Modifier } from '@eeeditor/editor';
import Immutable from 'immutable';

export const defaultAlignJustifyIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" fill="white" fillOpacity="0.01" />
    <path
      d="M42 19H6"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M42 9H6"
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
      d="M42 39H6"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createSetBlockDataButton<KeyCommand | false, false>({
  blockMetaData: {
    align: 'justify',
  },
  buttonType: 'align',
  defaultChildren: defaultAlignJustifyIcon,
  defaultTitle: {
    name: 'eeeditor.button.align.justify.tip.name',
  },
  defaultKeyCommand: {
    keyCode: 74,
    hasCommandModifier: true,
  },
  defaultSyntax: false,
  getKeyBindingFn: (keyCommand: KeyCommand) => (event) => {
    console.log('run justify bindingfn');
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
      console.log('align-justi');
      return 'align-justify';
    }
    return undefined;
  },
  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'align-justify') {
      setEditorState(
        EditorState.push(
          editorState,
          Modifier.mergeBlockData(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            Immutable.Map<string, string | boolean | number>({
              align: 'justify',
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
