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
    selection.extend(node, offset);
  } else {
    const range = selection.getRangeAt(0);
    range.setEnd(node, offset);
    // ie11
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
    console.log('因为 getHasFoucs() === false 不进行 revise');
    return;
  }

  if (!containsNode(document.documentElement, targetNode)) {
    console.log('因为 containsNode 不进行 revise');
    return;
  }

  const documentSelection = global.getSelection();
  let anchorKey = selection.getAnchorKey();
  let anchorOffset = selection.getAnchorOffset();
  let focusKey = selection.getFocusKey();
  let focusOffset = selection.getFocusOffset();
  let isBackward = selection.getIsBackward();

  const blockKey = block.getKey();

  // if (!selection.hasEdgeWithin(blockKey, 0, 0)) {
  //   console.log('因为 hasEdgeWithin 不进行revise')
  //   return;
  // }

  if (blockKey !== anchorKey && blockKey !== focusKey) {
    console.log('因为 no hasEdgeWithin 不进行 revise');
    return;
  }

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
    console.log('真的 revise 了');
    documentSelection.removeAllRanges();
    addPointToSelection(documentSelection, targetNode, 0);
    addFocusToSelection(documentSelection, targetNode, 0);
  }
};

export default reviseAtomicBlockSelection;
