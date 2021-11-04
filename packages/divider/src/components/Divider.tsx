import React, { useContext, useRef } from 'react';
import classNames from 'classnames';
import {
  SelectionState,
  ContentBlock,
  EEEditorContext,
} from '@eeeditor/editor';

export interface DividerProps {
  block: ContentBlock;
  blockProps: {
    isFocused?: boolean;
    focusable?: boolean;
    setFocusToBlock?: () => void;
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
  // focus plugin
  className?: string;
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
  const prefixCls = getPrefixCls('divider', customizePrefixCls);

  const hrRef = useRef<HTMLHRElement>();

  const dividerClassName = classNames(`${prefixCls}`, className);

  return <hr className={dividerClassName} ref={hrRef} {...elementProps} />;
};

export default Divider;
