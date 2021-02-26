import createBlockStyleButton from '../utils/createBlockStyleButton';

const defaultHeadlineFourIcon = (
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
      d="M39.9767 40V20L31 32.9967V35.0199H43"
      stroke="#333"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="bevel"
    />
  </svg>
);

export default createBlockStyleButton({
  blockType: 'header-four',
  buttonType: 'header',
  children: defaultHeadlineFourIcon,
});
