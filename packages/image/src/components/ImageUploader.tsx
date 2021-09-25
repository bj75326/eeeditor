import React, { useContext, useEffect, useRef } from 'react';
import classNames from 'classnames';
import {
  ContentBlock,
  SelectionState,
  EEEditorContext,
  ContentState,
} from '@eeeditor/editor';
import { Languages, zhCN, Locale, ImageEntityData } from '..';
import { Upload, UploadProps, Button } from 'antd';

export interface ImageUploaderProps {
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
  contentState: ContentState;
  blockStyleFn: unknown;
  preventScroll: unknown;
}

export interface ImageUploaderExtraProps {
  languages: Languages;
  uploadProps: UploadProps;
  prefixCls?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps & ImageUploaderExtraProps> = (
  props,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    languages,
    block, // eslint-disable-line @typescript-eslint/no-unused-vars
    uploadProps,
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

  const { getPrefixCls, locale: currLocale } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls('image-uploader', customizePrefixCls);
  const locale: Locale =
    currLocale && languages[currLocale] ? languages[currLocale] : zhCN;

  const { isFocused } = blockProps;

  const imgRef = useRef<HTMLImageElement>();

  useEffect(() => {}, []);

  const { src, status } = contentState
    .getEntity(block.getEntityAt(0))
    .getData() as ImageEntityData;

  console.log('elementProps ', elementProps);
  const layoutCls = classNames(`${prefixCls}-layout`, {
    isFocused: isFocused,
  });

  const imgCls = classNames(`${prefixCls}-img`, className);

  const statusCls = classNames(`${prefixCls}-status`, {
    [`@{prefixCls}-error`]: status === 'error',
  });

  const progressCls = classNames(`${prefixCls}-progress`, {
    [`@{prefixCls}-error`]: status === 'error',
  });

  return (
    <div className={layoutCls}>
      <img
        {...elementProps}
        src={src}
        className={imgCls}
        ref={imgRef}
        alt={locale['eeeditor.image.alt'] || 'eeeditor.image.alt'}
      />
      <div className={statusCls}>
        <div className={`${prefixCls}-status-text`}>
          {locale[`eeeditor.image.uploader.status.${status}`]}
        </div>
        {status !== 'error' && (
          <div className={`${prefixCls}-retry`}>
            <Upload {...uploadProps} openFileDialogOnClick={false}>
              <Button>test</Button>
            </Upload>
          </div>
        )}
      </div>
      <div className={progressCls}></div>
    </div>
  );
};

export default ImageUploader;