import createBlockStyleButton from '../utils/createBlockStyleButton';

const defaultHeadlineThreeIcon = (
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
      d="M24 8V40"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M7 24H23"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M32 20H42L35 29C39 29 42 31 42 35C42 39 39 40 37 40C34.619 40 33 39 32 37.9"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

export default createBlockStyleButton({
  blockType: 'header-three',
  buttonType: 'header',
  children: defaultHeadlineThreeIcon,
  defaultTitle: {
    name: 'eeeditor.button.h3.tooltip.name',
    shortcut: 'eeeditor.button.h3.tooltip.shortcut',
  },
});
