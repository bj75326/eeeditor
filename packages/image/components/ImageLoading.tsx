import React, { useContext, useEffect, useRef } from 'react';
import classNames from 'classnames';
import {
  ContentBlock,
  SelectionState,
  EEEditorContext,
} from '@eeeditor/editor';

export interface ImageLoadingProps {
  block: ContentBlock;
  blockProps: {
    isFocused: boolean;
  };
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

export interface ImageLoadingExtraProps {
  prefixCls?: string;
  className?: string;
}

const ImageLoading: React.FC<ImageLoadingProps & ImageLoadingExtraProps> = (
  props,
) => {
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

  const loadingRef = useRef<HTMLImageElement>();

  useEffect(() => {}, []);

  const loadingCls = classNames(`${prefixCls}`);
  return <div className={loadingCls}></div>;
};

export default ImageLoading;
