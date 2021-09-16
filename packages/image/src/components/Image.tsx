import React, { useContext } from 'react';
import {
  ContentBlock,
  SelectionState,
  ContentState,
  EEEditorContext,
} from '@eeeditor/editor';
import classNames from 'classnames';
import { Languages, zhCN, Locale, ImageEntityData } from '..';

export interface ImageProps {
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
  contentState: ContentState;
  blockStyleFn: unknown;
  preventScroll: unknown;
}

export interface ImageExtraProps {
  languages: Languages;
  prefixCls?: string;
  className?: string;
}

const Image: React.FC<ImageProps & ImageExtraProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    languages,
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

  const { getPrefixCls, locale: currLocale } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls('image', customizePrefixCls);
  const locale: Locale =
    currLocale && languages[currLocale] ? languages[currLocale] : zhCN;

  const { isFocused } = blockProps;

  const { src } = contentState
    .getEntity(block.getEntityAt(0))
    .getData() as ImageEntityData;

  return (
    <div>
      <img src={src} />
    </div>
  );
};

export default Image;
