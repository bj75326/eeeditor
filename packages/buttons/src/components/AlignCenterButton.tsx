import createSetBlockDataButton from '../utils/createSetBlockDataButton';
import {
  EditorState,
  Modifier,
  KeyCommand,
  checkKeyCommand,
  getSelectedBlocksMapKeys,
} from '@eeeditor/editor';
import Immutable from 'immutable';

export const defaultAlignCenterIcon = (
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
          d="M30,11 L6,11"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          fillRule="evenodd"
        />
        <path
          d="M36,1 L0,1"
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
          d="M30,31 L6,31"
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
    align: 'center',
  },
  buttonType: 'align',
  defaultChildren: defaultAlignCenterIcon,
  defaultTitle: {
    name: 'eeeditor.button.align.center.tip.name',
    shortcut: 'eeeditor.button.align.center.tip.shortcut',
  },
  defaultKeyCommand: {
    keyCode: 69,
    hasCommandModifier: true,
  },
  defaultSyntax: false,

  getKeyBindingFn: (keyCommand) => (event) => {
    if (keyCommand && checkKeyCommand(keyCommand, event)) {
      return 'align-center';
    }
    return undefined;
  },

  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'align-center') {
      // setEditorState(
      //   EditorState.push(
      //     editorState,
      //     Modifier.mergeBlockData(
      //       editorState.getCurrentContent(),
      //       editorState.getSelection(),
      //       Immutable.Map<string, string | boolean | number>({
      //         align: 'center',
      //       }),
      //     ),
      //     'change-block-data',
      //   ),
      // );
      const blockMetaData = { align: 'center' };
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
