export interface SideToolbarPosition {
  top?: number;
  left?: number;
  right?: number;
}

export const getSideToolbarPosition = (
  referenceEl: HTMLElement,
  rtl: boolean,
  // toolbarEl: HTMLElement,
): SideToolbarPosition => {
  return rtl
    ? {
        top: referenceEl.offsetTop + referenceEl.offsetHeight / 2,
        right: -32,
      }
    : {
        top: referenceEl.offsetTop + referenceEl.offsetHeight / 2,
        left: -32,
      };
};

export default getSideToolbarPosition;
