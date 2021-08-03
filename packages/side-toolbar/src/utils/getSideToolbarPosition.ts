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
  // 段落元素(referenceEl)与根元素(roolEl)之间的距离 (margin or padding) 计算
  // note: 段落元素 referenceEl 默认是没有 padding 或者 margin 的
  // const referenceElRect = referenceEl.getBoundingClientRect();
  // const rootElRect = rootEl.getBoundingClientRect();
  // const referenceElOffsetRight = rootElRect.right - referenceElRect.right;
  // const referenceElOffsetLeft = referenceElRect.left - rootElRect.left;
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
