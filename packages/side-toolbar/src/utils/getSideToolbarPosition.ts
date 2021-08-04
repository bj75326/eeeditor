export interface SideToolbarPosition {
  top?: number;
  left?: number;
  right?: number;
}

export const getSideToolbarPosition = (
  referenceEl: HTMLElement,
  toolbarEl: HTMLElement,
  rtl: boolean,
): SideToolbarPosition => {
  return rtl
    ? {
        top: referenceEl.offsetTop + referenceEl.offsetHeight / 2,
        right: -toolbarEl.offsetWidth,
      }
    : {
        top: referenceEl.offsetTop + referenceEl.offsetHeight / 2,
        left: -toolbarEl.offsetWidth,
      };
};

export default getSideToolbarPosition;
