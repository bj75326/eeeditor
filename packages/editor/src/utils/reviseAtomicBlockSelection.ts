// built-in focus plugin
// 每次 selection 变化之后，focusable atomic block 计算 selection 使用

import { SelectionState, ContentBlock } from 'draft-js';
import containsNode from 'fbjs/lib/containsNode';
import getActiveElement from 'fbjs/lib/getActiveElement';

const addFocusToSelection = (
  selection: Selection,
  node: Node,
  offset: number = 0,
) => {
  const activeElement = getActiveElement();
  if (selection.extend && containsNode(activeElement, node)) {
    // eeeditor 将不支持 IE, 暂时保留
    selection.extend(node, offset);
  } else {
    const range = selection.getRangeAt(0);
    range.setEnd(node, offset);
    // todo
    selection.addRange(range.cloneRange());
  }
};

const addPointToSelection = (
  selection: Selection,
  node: Node,
  offset: number = 0,
) => {
  const range = document.createRange();
  range.setStart(node, offset);
  selection.addRange(range);
};

export const reviseAtomicBlockSelection = (
  selection: SelectionState,
  block: ContentBlock,
  targetNode: Node,
) => {
  if (selection == null || !selection.getHasFocus()) {
    return;
  }

  const blockKey = block.getKey();

  if (!selection.hasEdgeWithin(blockKey, 0, 0)) {
    return;
  }

  if (!containsNode(document.documentElement, targetNode)) {
    return;
  }

  const documentSelection = global.getSelection();
  let anchorKey = selection.getAnchorKey();
  let anchorOffset = selection.getAnchorOffset();
  let focusKey = selection.getFocusKey();
  let focusOffset = selection.getFocusOffset();
  let isBackward = selection.getIsBackward();

  // IE doesn't support backward selection. Swap key/offset pairs.
  // eeeditor 将不支持 IE, 暂时保留
  if (!documentSelection.extend && isBackward) {
    var tempKey = anchorKey;
    var tempOffset = anchorOffset;
    anchorKey = focusKey;
    anchorOffset = focusOffset;
    focusKey = tempKey;
    focusOffset = tempOffset;
    isBackward = false;
  }

  const hasAnchor = anchorKey === blockKey;
  const hasFocus = focusKey === blockKey;

  if (hasAnchor || hasFocus) {
    documentSelection.removeAllRanges();
    addPointToSelection(documentSelection, targetNode, 0);
    addFocusToSelection(documentSelection, targetNode, 0);
  }
};

export default reviseAtomicBlockSelection;
