import createBlockStyleButton from '../utils/createBlockStyleButton';

const defaultHeadlineSixIcon = (
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
      d="M36.5 40C39.5376 40 42 37.5376 42 34.5C42 31.4624 39.5376 29 36.5 29C33.4624 29 31 31.4624 31 34.5C31 37.5376 33.4624 40 36.5 40Z"
      stroke="#333"
      stroke-width="3"
    />
    <path
      d="M41.5962 24.7392C40.7778 22.5461 38.8044 21 36.5 21C33.4624 21 31 23.6863 31 27V34"
      stroke="#333"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="bevel"
    />
  </svg>
);

export default createBlockStyleButton({
  blockType: 'header-six',
  buttonType: 'header',
  children: defaultHeadlineSixIcon,
});
