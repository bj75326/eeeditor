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
        top: referenceEl.offsetTop,
        right: -32,
      }
    : {
        top: referenceEl.offsetTop,
        left: -32,
      };
};

export default getSideToolbarPosition;
