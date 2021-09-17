import React, { useContext, useEffect, useRef } from 'react';
import classNames from 'classnames';
import {
  SelectionState,
  ContentBlock,
  EEEditorContext,
} from '@eeeditor/editor';

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

export interface DividerProps {
  block: ContentBlock;
  blockProps: {
    isFocused: boolean;
  };
  customStyleMap: unknown;
  customStyleFn: unknown;
  decorator: unknown;
  direction: unknown;
  forceSelection: unknown;
  offsetKey: unknown;
  selection: SelectionState;
  tree: unknown;
  contentState: unknown;
  blockStyleFn: unknown;
  preventScroll: unknown;
}

export interface DividerExtraProps extends React.HTMLAttributes<HTMLHRElement> {
  prefixCls?: string;
  className?: string;
}

const Divider: React.FC<DividerProps & DividerExtraProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    block, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...otherProps
  } = props;

  const {
    blockProps, // eslint-disable-line @typescript-eslint/no-unused-vars
    customStyleMap, // eslint-disable-line @typescript-eslint/no-unused-vars
    customStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
    decorator, // eslint-disable-line @typescript-eslint/no-unused-vars
    direction, // eslint-disable-line @typescript-eslint/no-unused-vars
    forceSelection, // eslint-disable-line @typescript-eslint/no-unused-vars
    offsetKey, // eslint-disable-line @typescript-eslint/no-unused-vars
    selection, // eslint-disable-line @typescript-eslint/no-unused-vars
    tree, // eslint-disable-line @typescript-eslint/no-unused-vars
    contentState, // eslint-disable-line @typescript-eslint/no-unused-vars
    blockStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
    preventScroll, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...elementProps
  } = otherProps;

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  const { isFocused } = blockProps;

  const hrNode = useRef<HTMLHRElement>();

  useEffect(() => {
    console.log('divider componentDidUpdate run!!!!');
    if (selection == null || !selection.getHasFocus()) {
      return;
    }

    const blockKey = block.getKey();

    console.log(
      'divider hasEdgeWithin ',
      selection.hasEdgeWithin(blockKey, 0, 0),
    );
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
    // atomic editable === false 的 block 不需要比较 offset
    const hasAnchor = anchorKey === blockKey;
    const hasFocus = focusKey === blockKey;

    console.log('hasAnchor after ', hasAnchor);
    console.log('hasFocus after ', hasFocus);

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
  const dividerClassName = classNames(`${prefixCls}-divider`, className, {
    isFocused: isFocused,
  });

  return <hr className={dividerClassName} ref={hrNode} {...elementProps} />;
};

export default Divider;
