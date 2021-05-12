export const getSelectionCoords = (
  toStart?: boolean,
): { x: number; y: number } => {
  let x = 0,
    y = 0;

  if (window.getSelection) {
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0).cloneRange();
      if (range.getClientRects) {
        range.collapse(toStart);
        const rects = range.getClientRects();
        console.log('rects: ', rects);
        let rect: DOMRect = null;
        if (rects.length > 0) {
          rect = rects[0];
        }
        if (rect) {
          x = rect.left;
          y = rect.top;
        }
      }
    }
  }
  console.log('{x, y}: ', x);
  console.log('{x, y}: ', y);
  return { x, y };
};

export const getRangeCoords = (
  range: Range,
  toStart?: boolean,
): { x: number; y: number } => {
  let x = 0,
    y = 0;

  if (!range.collapsed) {
    range.collapse(toStart);
  }

  if (range.getClientRects) {
    const rects = range.getClientRects();
    if (rects.length > 0) {
      const rect = rects[0];
      if (rect) {
        x = rect.left;
        y = rect.top;
      }
    }
  }

  return { x, y };
};

export default getRangeCoords;
