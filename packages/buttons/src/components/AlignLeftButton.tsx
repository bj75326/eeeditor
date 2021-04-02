import createSetBlockDataButton from '../utils/createSetBlockDataButton';

const defaultAlignLeftIcon = (
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

export default createSetBlockDataButton({
  blockMetaData: {
    align: 'left',
  },
  buttonType: 'align',
  defaultChildren: defaultAlignLeftIcon,
  defaultTitle: {
    name: 'eeeditor.button.align.left.tip.name',
  },
});
