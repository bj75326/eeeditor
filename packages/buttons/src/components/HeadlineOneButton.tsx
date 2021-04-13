import createToggleBlockTypeButton from '../utils/createToggleBlockTypeButton';
import {
  RichUtils,
  Modifier,
  EditorState,
  KeyBindingUtil,
} from '@eeeditor/editor';

export const defaultHeadlineOneIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 8V40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M25 8V40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M6 24H25"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M34.2261 24L39.0001 19.0166V40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createToggleBlockTypeButton({
  blockType: 'header-one',
  buttonType: 'header',
  defaultChildren: defaultHeadlineOneIcon,
  defaultTitle: {
    name: 'eeeditor.button.h1.tip.name',
    shortcut: 'eeeditor.button.h1.tip.shortcut',
  },
  defaultKeyCommand: false,
  defaultSyntax: '# ',
  // buttonBeforeInputHandler(chars, editorState, { setEditorState }) {
  //   const selection = editorState.getSelection();
  //   const contentState = editorState.getCurrentContent();
  //   const strBefore = contentState
  //     .getBlockForKey(selection.getStartKey())
  //     .getText()
  //     .slice(0, selection.getStartOffset());

  //   // 默认只有在 selection anchor & focus offset 相同的情况下，依次输入 '#'，' ' 才会通过 shortcut toggle block type
  //   if (`${strBefore}${chars}` === '# ' && selection.isCollapsed()) {
  //     const newContentState = Modifier.removeRange(
  //       RichUtils.toggleBlockType(
  //         editorState,
  //         'header-one',
  //       ).getCurrentContent(),
  //       selection.merge({
  //         anchorOffset: 0,
  //         focusOffset: selection.getEndOffset(),
  //         isBackward: false,
  //       }),
  //       'backward',
  //     );
  //     setEditorState(
  //       EditorState.push(editorState, newContentState, 'change-block-type'),
  //     );
  //     return 'handled';
  //   }
  //   return 'not-handled';
  // },
  getKeyBindingFn: (keyCommand) => (event) => {
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
      return 'header-one';
    }
    return undefined;
  },

  buttonKeyCommandHandler: (command, editorState, { setEditorState }) => {
    if (command === 'header-one') {
      setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'));
      return 'handled';
    }
    return 'not-handled';
  },

  getBeforeInputHandler: (syntax) => (
    chars,
    editorState,
    { setEditorState },
  ) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const strBefore = contentState
      .getBlockForKey(selection.getStartKey())
      .getText()
      .slice(0, selection.getStartOffset());

    // 默认只有在 selection anchor & focus offset 相同的情况下，依次输入 '#'，' ' 才会通过 shortcut toggle block type
    if (`${strBefore}${chars}` === syntax && selection.isCollapsed()) {
      const newContentState = Modifier.removeRange(
        RichUtils.toggleBlockType(
          editorState,
          'header-one',
        ).getCurrentContent(),
        selection.merge({
          anchorOffset: 0,
          focusOffset: selection.getEndOffset(),
          isBackward: false,
        }),
        'backward',
      );
      setEditorState(
        EditorState.push(editorState, newContentState, 'change-block-type'),
      );
      return 'handled';
    }
    return 'not-handled';
  },
});
