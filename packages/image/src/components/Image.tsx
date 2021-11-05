import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  ContentBlock,
  SelectionState,
  ContentState,
  EEEditorContext,
} from '@eeeditor/editor';
import classNames from 'classnames';
import {
  Languages,
  zhCN,
  Locale,
  ImageEntityData,
  ImagePluginStore,
  BeforeUploadValueType,
} from '..';
import { UploadProps, Button, Popover } from 'antd';
import { file2Obj } from 'antd/lib/upload/utils';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import request from 'rc-upload/lib/request';
import {
  UploadProgressEvent,
  UploadRequestError,
} from 'rc-upload/lib/interface';

export interface ImageProps {
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
  contentState: ContentState;
  blockStyleFn: unknown;
  preventScroll: unknown;
  // focus plugin
  className?: string;
}

export interface ImageExtraProps {
  languages: Languages;
  uploadProps: UploadProps;
  store: ImagePluginStore;
  prefixCls?: string;
  className?: string;
}

const Image: React.FC<ImageProps & ImageExtraProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    languages,
    block, // eslint-disable-line @typescript-eslint/no-unused-vars
    uploadProps,
    store,
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
  const prefixCls = getPrefixCls('image', customizePrefixCls);
  const locale: Locale =
    currLocale && languages[currLocale] ? languages[currLocale] : zhCN;

  const { isFocused, focusable, setFocusToBlock } = blockProps;

  const { src } = contentState
    .getEntity(block.getEntityAt(0))
    .getData() as ImageEntityData;

  const blockData = block.getData();
  const figcaption = blockData.get('figcaption');
  const size = blockData.get('size');

  const [status, setStatus] = useState<'uploading' | 'error' | 'success'>(
    src.startsWith('blob:') ? 'uploading' : 'success',
  );

  const imgRef = useRef<HTMLImageElement>();

  // 当前网页，新上传的 image 才会有 file 对象
  const file = store.getItem('fileMap')[block.getEntityAt(0)];

  const onStatusMapChanged = (
    statusMap: Record<string, 'uploading' | 'error' | 'success'>,
  ) => {
    if (file) {
      setStatus(statusMap[file.uid]);
    }
  };

  useEffect(() => {
    store.subscribeToItem('statusMap', onStatusMapChanged);
    return () => {
      store.unsubscribeFromItem('statusMap', onStatusMapChanged);
    };
  }, []);

  //
  // useEffect(() => {
  //   if (focusable) {
  //     reviseAtomicBlockSelection(
  //       selection,
  //       block,
  //       status === 'success' ? imgRef.current : previewRef.current,
  //     );
  //   }
  // });

  // click 事件发生在 select 事件之后，eeeditor focus plugin 手动更改 原生 selection 放在 mouseup 事件内
  // const handleImageClick = () => {
  //   console.log('handleImageClick');
  //   if (focusable) {
  //     setFocusToBlock(
  //       status === 'success' ? imgRef.current : previewRef.current,
  //     );
  //   }
  // };

  const onFigcaptionMouseUp = () => {};

  const retryUpload = async () => {
    const {
      name,
      method,
      headers,
      withCredentials,
      action,
      data,
      customRequest,
      beforeUpload,
      onChange,
    } = uploadProps;

    // let transformedFile: BeforeUploadFileType | void = file;
    let transformedFile: BeforeUploadValueType = await beforeUpload(
      file,
      undefined,
    );

    if (transformedFile === false) return;

    // action
    let mergedAction: string;
    if (typeof action === 'function') {
      mergedAction = await action(file);
    } else {
      mergedAction = action;
    }

    // data
    let mergedData: object;
    if (typeof data === 'function') {
      mergedData = await data(file);

      // todo 开发使用配置 必须删除！！！
      mergedData['access_token'] = '43ffba06ed1a8f2aa2976fc7c1e7009c';
    } else {
      mergedData = data;

      // todo 开发使用配置 必须删除！！！
      mergedData['access_token'] = '43ffba06ed1a8f2aa2976fc7c1e7009c';
    }

    // file 参考 https://github.com/react-component/upload/blob/master/src/AjaxUploader.tsx
    const parsedData =
      // string type is from legacy `transformFile`.
      // Not sure if this will work since no related test case works with it
      (typeof transformedFile === 'object' ||
        typeof transformedFile === 'string') &&
      transformedFile
        ? transformedFile
        : file;

    let parsedFile: File;
    if (parsedData instanceof File) {
      parsedFile = parsedData;
    } else {
      parsedFile = new File([parsedData], file.name, { type: file.type });
    }

    const mergedParsedFile: RcFile = parsedFile as RcFile;
    mergedParsedFile.uid = file.uid;

    const requestOption = {
      action: mergedAction,
      fileName: name,
      data: mergedData,
      file: mergedParsedFile,
      headers,
      withCredentials,
      method: method || 'post',
      onProgress: (e: UploadProgressEvent) => {
        console.log('retry onProgress', status);
        const targetItem = file2Obj(mergedParsedFile);
        targetItem.status = 'uploading';
        targetItem.percent = e.percent;

        onChange({
          file: targetItem as UploadFile,
          fileList: undefined,
          event: e,
        });
      },
      onSuccess: (ret: any, xhr: XMLHttpRequest) => {
        try {
          if (typeof ret === 'string') {
            ret = JSON.parse(ret);
          }
        } catch (e) {
          /* do nothing */
        }

        const targetItem = file2Obj(file);
        targetItem.status = 'done';
        targetItem.percent = 100;
        targetItem.response = ret;
        targetItem.xhr = xhr;

        onChange({
          file: targetItem as UploadFile,
          fileList: undefined,
        });
      },
      onError: (err: UploadRequestError, ret: any) => {
        const targetItem = file2Obj(mergedParsedFile);
        targetItem.error = err;
        targetItem.response = ret;
        targetItem.status = 'error';

        onChange({
          file: targetItem as UploadFile,
          fileList: undefined,
        });
      },
    };

    if (customRequest) {
      customRequest(requestOption);
    } else {
      request(requestOption);
    }
  };

  const figcaptionInput = (
    <div>
      <textarea
        placeholder={
          locale['eeeditor.image.figcaption.placeholder'] ||
          'eeeditor.image.figcaption.placeholder'
        }
      />
    </div>
  );

  const imageCls = classNames(`${prefixCls}`, className, {
    [`${prefixCls}-uploading`]: status !== 'success',
  });

  const statusTextCls = classNames(`${prefixCls}-status-text`, {
    isError: status === 'error',
  });

  const progressCls = classNames(`${prefixCls}-progress`, {
    isError: status === 'error',
  });

  const uploaderLayout = (
    <>
      <img
        src={src}
        className={imageCls}
        alt={locale['eeeditor.image.alt'] || 'eeeditor.image.alt'}
      />
      <div className={`${prefixCls}-status`}>
        <div className={statusTextCls}>
          {locale[`eeeditor.image.uploader.status.${status}`]}
        </div>
        {status === 'error' && (
          <div className={`${prefixCls}-retry`}>
            <Button onClick={retryUpload}>test</Button>
          </div>
        )}
      </div>
      <div className={progressCls}>
        {status === 'uploading' && (
          <div className={`${prefixCls}-loading-bar`}></div>
        )}
      </div>
    </>
  );

  const imageLayout = (
    <>
      <img
        src={src}
        className={imageCls}
        alt={locale['eeeditor.image.alt'] || 'eeeditor.image.alt'}
      />
      {(isFocused || figcaption) && (
        <Popover
          content={figcaptionInput}
          trigger="click"
          overlayClassName={`${prefixCls}-figcaption-popover`}
          align={{
            points: ['tc', 'tc'],
            offset: [0, 0],
            targetOffset: [0, 0],
          }}
          transitionName=""
        >
          <figcaption
            className={`${prefixCls}-figcaption`}
            onMouseUp={onFigcaptionMouseUp}
          >
            {figcaption ||
              locale['eeeditor.image.figcaption.placeholder'] ||
              'eeeditor.image.figcaption.placeholder'}
          </figcaption>
        </Popover>
      )}
    </>
  );

  return (
    <div className={`${prefixCls}-layout`} ref={imgRef} {...elementProps}>
      {status === 'success' ? imageLayout : uploaderLayout}
    </div>
  );
};

export default Image;
