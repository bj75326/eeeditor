export const getPopoverPlacement = (
  target: HTMLElement,
  top: number = 40,
): 'top' | 'bottom' => {
  const targetRect = target.getBoundingClientRect();
  if (targetRect.top < top) {
    return 'bottom';
  } else {
    return 'top';
  }
};

export default getPopoverPlacement;
