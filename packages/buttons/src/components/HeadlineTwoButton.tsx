import createBlockStyleButton from '../utils/createBlockStyleButton';

const defaultHeadlineTwoIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 8V40"
      stroke="#333"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="bevel"
    />
    <path
      d="M24 8V40"
      stroke="#333"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="bevel"
    />
    <path
      d="M7 24H23"
      stroke="#333"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="bevel"
    />
    <path
      d="M32 25C32 21.8334 34.6667 20 37 20C39.3334 20 42 21.8334 42 25C42 30.7 32 34.9333 32 40H42"
      stroke="#333"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="bevel"
    />
  </svg>
);

export default createBlockStyleButton({
  blockType: 'header-two',
  buttonType: 'header',
  children: defaultHeadlineTwoIcon,
});
