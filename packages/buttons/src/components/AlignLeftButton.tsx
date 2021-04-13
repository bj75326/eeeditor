import createSetBlockDataButton from '../utils/createSetBlockDataButton';
import { KeyCommand } from '..';
import { KeyBindingUtil, EditorState, Modifier } from '@eeeditor/editor';
import Immutable from 'immutable';

export const defaultAlignLeftIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <rect
        width="48"
        height="48"
        fill="white"
        fillOpacity="0.01"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        strokeWidth="3"
        stroke="none"
        fillRule="evenodd"
      />
      <g transform="translate(6.000000, 8.000000)">
        <path
          d="M36,1 L3.55271368e-15,1"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          fillRule="evenodd"
        />
        <path
          d="M28,11 L5.32907052e-15,11"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          fillRule="evenodd"
        />
        <path
          d="M36,21 L0,21"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          fillRule="evenodd"
        />
        <path
          d="M28,31 L5.32907052e-15,31"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          fillRule="evenodd"
        />
      </g>
    </g>
  </svg>
);

export default createSetBlockDataButton<KeyCommand | false, false>({
  blockMetaData: {
    align: 'left',
  },
  buttonType: 'align',
  defaultChildren: defaultAlignLeftIcon,
  defaultTitle: {
    name: 'eeeditor.button.align.left.tip.name',
  },
  defaultKeyCommand: {
    keyCode: 76,
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
      return 'align-left';
    }
    return undefined;
  },
  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'align-left') {
      setEditorState(
        EditorState.push(
          editorState,
          Modifier.mergeBlockData(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            Immutable.Map<string, string | boolean | number>({
              align: 'left',
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
