import createSetBlockDataButton from '../utils/createSetBlockDataButton';
import {
  EditorState,
  Modifier,
  KeyCommand,
  checkKeyCommand,
  getSelectedBlocksMapKeys,
} from '@eeeditor/editor';
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
    shortcut: 'eeeditor.button.align.justify.tip.shortcut',
  },
  defaultKeyCommand: {
    keyCode: 74,
    hasCommandModifier: true,
  },
  defaultSyntax: false,

  getKeyBindingFn: (keyCommand) => (event) => {
    if (keyCommand && checkKeyCommand(keyCommand, event)) {
      return 'align-justify';
    }
    return undefined;
  },

  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'align-justify') {
      // setEditorState(
      //   EditorState.push(
      //     editorState,
      //     Modifier.mergeBlockData(
      //       editorState.getCurrentContent(),
      //       editorState.getSelection(),
      //       Immutable.Map<string, string | boolean | number>({
      //         align: 'justify',
      //       }),
      //     ),
      //     'change-block-data',
      //   ),
      // );
      const blockMetaData = { align: 'justify' };
      if (
        getSelectedBlocksMapKeys(editorState).some((value) => {
          const block = editorState.getCurrentContent().getBlockForKey(value);
          return Object.keys(blockMetaData).some(
            (key) => blockMetaData[key] !== block.getData().get(key),
          );
        })
      ) {
        // 1. selectionState 选中的所有 block 至少有一个没有设置对应的 metaData，则进行 merge metaData
        setEditorState(
          EditorState.push(
            editorState,
            Modifier.mergeBlockData(
              editorState.getCurrentContent(),
              editorState.getSelection(),
              Immutable.Map<string, string | boolean | number>(blockMetaData),
            ),
            'change-block-data',
          ),
        );
      } else {
        // 2. selectionState 选中的所有 block 全都已经设置了对应的 metaData，则进行 toggle metaData
        const initMetaData = {};
        Object.keys(blockMetaData).forEach(
          (key) => (initMetaData[key] = undefined),
        );
        setEditorState(
          EditorState.push(
            editorState,
            Modifier.mergeBlockData(
              editorState.getCurrentContent(),
              editorState.getSelection(),
              Immutable.Map<string, string | boolean | number>(initMetaData),
            ),
            'change-block-data',
          ),
        );
      }

      return 'handled';
    }
    return 'not-handled';
  },
});
