import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { SelectionState, ContentBlock } from '@eeeditor/editor';

import getActiveElement from 'fbjs/lib/getActiveElement';
import containsNode from 'fbjs/lib/containsNode';

const addFocusToSelection = (
  selection: Selection,
  node: Node,
  offset: number,
  selectionState: SelectionState,
): void => {
  const activeElement = getActiveElement();
  if (selection.extend && containsNode(activeElement, node)) {
    selection.extend(node, offset);
  } else {
    const range = selection.getRangeAt(0);
    range.setEnd(node, offset);
    selection.addRange(range.cloneRange());
  }
};

const addPointToSelection = (
  selection: Selection,
  node: Node,
  offset: number,
  selectonState: SelectionState,
): void => {
  const range = document.createRange();
  range.setStart(node, offset);
  selection.addRange(range);
};

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  prefixCls?: string;
  className: string;
  // style?: CSSProperties;
  //removed types
  block: ContentBlock;
  blockProps: unknown;
  customStyleMap: unknown;
  customStyleFn: unknown;
  decorator: unknown;
  forceSelection: unknown;
  offsetKey: unknown;
  selection: SelectionState;
  tree: unknown;
  contentState: unknown;
  blockStyleFn: unknown;
  preventScroll: unknown;
}

const Divider: React.FC<DividerProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    block, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...otherProps
  } = props;

  const {
    blockProps, // eslint-disable-line @typescript-eslint/no-unused-vars
    customStyleMap, // eslint-disable-line @typescript-eslint/no-unused-vars
    customStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
    decorator, // eslint-disable-line @typescript-eslint/no-unused-vars
    forceSelection, // eslint-disable-line @typescript-eslint/no-unused-vars
    offsetKey, // eslint-disable-line @typescript-eslint/no-unused-vars
    selection, // eslint-disable-line @typescript-eslint/no-unused-vars
    tree, // eslint-disable-line @typescript-eslint/no-unused-vars
    contentState, // eslint-disable-line @typescript-eslint/no-unused-vars
    blockStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
    preventScroll, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...elementProps
  } = otherProps;

  const hrNode = useRef(null);

  useEffect(() => {
    console.log('divider componentDidUpdate run!!!!');
    if (selection == null || !selection.getHasFocus()) {
      return;
    }

    const blockKey = block.getKey();

    if (!selection.hasEdgeWithin(blockKey, 0, 0)) {
      return;
    }

    const documentSelection = global.getSelection();
    let anchorKey = selection.getAnchorKey();
    let anchorOffset = selection.getAnchorOffset();
    let focusKey = selection.getFocusKey();
    let focusOffset = selection.getFocusOffset();
    let isBackward = selection.getIsBackward();

    if (!documentSelection.extend && isBackward) {
      const tempKey = anchorKey;
      const tempOffset = anchorOffset;
      anchorKey = focusKey;
      anchorOffset = focusOffset;
      focusKey = tempKey;
      focusOffset = tempOffset;
      isBackward = false;
    }

    const hasAnchor = anchorKey === blockKey && anchorOffset === 0;

    const hasFocus = focusKey === blockKey && focusOffset === 0;

    if (hasAnchor || hasFocus) {
      documentSelection.removeAllRanges();
      addPointToSelection(documentSelection, hrNode.current, 0, selection);
      addFocusToSelection(documentSelection, hrNode.current, 0, selection);
    }

    // if (hasAnchor && hasFocus) {
    //   documentSelection.removeAllRanges();
    //   addPointToSelection(documentSelection, hrNode.current, 0, selection);
    //   addFocusToSelection(documentSelection, hrNode.current, 0, selection);
    //   return;
    // }

    // if (!isBackward) {
    //   if (hasAnchor) {
    //     documentSelection.removeAllRanges();
    //     addPointToSelection(documentSelection, hrNode.current, 0, selection);
    //     addFocusToSelection(documentSelection, hrNode.current, 0, selection);
    //   }
    //   if (hasFocus) {
    //     documentSelection.removeAllRanges();
    //     addFocusToSelection(documentSelection, hrNode.current, 0, selection);
    //   }
    // } else {
    //   if (hasFocus) {
    //     //documentSelection.removeAllRanges();
    //     addFocusToSelection(documentSelection, hrNode.current, 0, selection);
    //   }
    //   if (hasAnchor) {
    //     // const storedFocusNode = documentSelection.focusNode;
    //     // const storedFocusOffset = documentSelection.focusOffset;

    //     documentSelection.removeAllRanges();
    //     addPointToSelection(documentSelection, hrNode.current, 0, selection);
    //     // addFocusToSelection(documentSelection, storedFocusNode, storedFocusOffset, selection);
    //     addFocusToSelection(documentSelection, hrNode.current, 0, selection);
    //   }
    // }
  });

  const dividerClassName = classNames(`${prefixCls}-divider`, className);

  return <hr className={dividerClassName} ref={hrNode} {...elementProps} />;
};

export default Divider;
