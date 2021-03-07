import createInlineStyleButton from '../utils/createInlineStyleButton';

const defaultCodeIcon = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 6H36"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M12 42H28"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M29 5.95239L19 42"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createInlineStyleButton({
  inlineStyle: 'ITALIC',
  buttonType: 'italic',
  children: defaultCodeIcon,
  defaultTitle: {
    name: 'eeeditor.button.italic.tip.name',
    shortcut: 'eeeditor.button.italic.tip.shortcut',
  },
});
