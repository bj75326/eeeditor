import createBlockStyleButton from '../utils/createBlockStyleButton';
import { RichUtils } from '@eeeditor/editor';

const defaultHeadlineOneIcon = (
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

export default createBlockStyleButton({
  blockType: 'header-one',
  buttonType: 'header',
  children: defaultHeadlineOneIcon,
  defaultTitle: {
    name: 'eeeditor.button.h1.tip.name',
    shortcut: 'eeeditor.button.h1.tip.shortcut',
  },
  buttonBeforeInputHandler(chars, editorState, _, pluginFunctions) {
    console.log('buttonBeforeInputHnadler run!!!', chars);
    if (chars === '# ') {
      RichUtils.toggleBlockType(editorState, 'header-one');
      return 'handled';
    }
    return 'not-handled';
  },
});
