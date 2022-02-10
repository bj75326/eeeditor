import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  FocusEvent,
  MouseEvent,
  useLayoutEffect,
} from 'react';
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
import { UploadProps, Button } from 'antd';
import { file2Obj } from 'antd/lib/upload/utils';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import request from 'rc-upload/lib/request';
import {
  UploadProgressEvent,
  UploadRequestError,
} from 'rc-upload/lib/interface';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { CropBarPosition, CORNER_SIZE, OFFSET } from './CropButton';

const convertBarPosition = (position: string): CropBarPosition => {
  if (!position) return null;
  const coords: string[] = position.split(',');
  return {
    x: +coords[0].trim(),
    y: +coords[1].trim(),
  };
};

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
  offsetKey: string;
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
  console.log('image re-render');
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

  const { getEditorState } = store.getItem('pluginMethods');

  const { getPrefixCls, locale: currLocale } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls('image', customizePrefixCls);
  const locale: Locale =
    currLocale && languages[currLocale] ? languages[currLocale] : zhCN;

  const { isFocused } = blockProps;

  const { src } = contentState
    .getEntity(block.getEntityAt(0))
    .getData() as ImageEntityData;

  // image atomic block data
  const blockData = block.getData();
  // figcaption
  const figcaption = blockData.get('figcaption');
  // width
  const width = blockData.get('width');
  // crop positions
  const cropTl = convertBarPosition(blockData.get('cropTl'));
  const cropT = convertBarPosition(blockData.get('cropT'));
  const cropTr = convertBarPosition(blockData.get('cropTr'));
  const cropL = convertBarPosition(blockData.get('cropL'));
  const cropR = convertBarPosition(blockData.get('cropR'));
  const cropBl = convertBarPosition(blockData.get('cropBl'));
  const cropB = convertBarPosition(blockData.get('cropB'));
  const cropBr = convertBarPosition(blockData.get('cropBr'));

  // image 状态
  const [status, setStatus] = useState<'uploading' | 'error' | 'success'>(
    src.startsWith('blob:') ? 'uploading' : 'success',
  );

  // image figcaption popover 显示隐藏状态
  const [figcaptionEditPopoverVisible, setFigcaptionEditPopoverVisible] =
    useState<boolean>(false);

  const imgRef = useRef<HTMLImageElement>();

  // 当前网页，新上传的 image 才会有 file 对象
  const file = store.getItem('fileMap')[block.getEntityAt(0)];

  // 传递给各个 popover 的数据
  const imagePropsRef = useRef<Partial<ImageProps>>();
  imagePropsRef.current = {
    block,
    offsetKey,
  };
  const getImageProps = () => imagePropsRef.current;

  const onStatusMapChanged = (
    statusMap: Record<string, 'uploading' | 'error' | 'success'>,
  ) => {
    if (file) {
      console.log('statusMap[file.uid] ', statusMap[file.uid]);
      setStatus(statusMap[file.uid]);
    }
  };

  useEffect(() => {
    store.subscribeToItem('statusMap', onStatusMapChanged);
    return () => {
      store.unsubscribeFromItem('statusMap', onStatusMapChanged);
    };
  }, []);

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

  const onFigcaptionMouseUp = (e: MouseEvent) => {
    console.log('onFigcaptionMouseUp');

    // focusable block selection offset 应该被限制在固定位置0
    // e.stopPropagation();

    store.updateItem('getBlockProps', getImageProps);
    store.updateItem('figcaptionEditPopoverVisible', true);

    setFigcaptionEditPopoverVisible(true);
  };

  // showFigcaption 的作用是在焦点从 figcaption textarea 回到对应 image 上的时候
  // 阻止 figcaption 闪烁一次
  // onMouseDown (showFigcaption = true) --->
  // figcaptionTextareaBlur (figcaptionTextareaVisible = false, showFigcaption = true) --->
  // figcaptionTextareaBlur useEffect (figcaptionTextareaVisible = false, showFigcaption = false) --->
  // onFocus (另外处理)
  const showFigcaption = useRef<boolean>(false);

  const onImageMouseDown = () => {
    console.log('onImageMouseDown');
    if (figcaptionEditPopoverVisible) {
      showFigcaption.current = true;
    }
  };

  useEffect(() => {
    if (imgRef.current) {
      console.log(
        'imgRef.current.parentElement ',
        imgRef.current.parentElement,
      );
      const cleanOutsiderHandler = addEventListener(
        imgRef.current.parentElement,
        'mousedown',
        onImageMouseDown,
      );
      return () => {
        cleanOutsiderHandler.remove();
      };
    }
  }, [figcaptionEditPopoverVisible]);

  useEffect(() => {
    if (showFigcaption.current) {
      showFigcaption.current = false;
    }
  }, [getEditorState().getSelection().getHasFocus()]);

  const shouldShowFigcaption = (): boolean => {
    return (
      isFocused || // blockProps.isFocused, focus plugin 提供
      figcaption || // block data
      figcaptionEditPopoverVisible || // 当 figcaption edit popover 显示时占位
      showFigcaption.current // 点击当前 image 使 figcaption edit textarea 失去焦点时，避免 figcaption 闪烁
    );
  };

  const onFigcaptionEditPopoverVisibleChange = (visible: boolean) => {
    if (!visible && figcaptionEditPopoverVisible) {
      setFigcaptionEditPopoverVisible(false);
    }
  };

  useEffect(() => {
    store.subscribeToItem(
      'figcaptionEditPopoverVisible',
      onFigcaptionEditPopoverVisibleChange,
    );
    return () => {
      store.unsubscribeFromItem(
        'figcaptionEditPopoverVisible',
        onFigcaptionEditPopoverVisibleChange,
      );
    };
  }, [figcaptionEditPopoverVisible]);

  // const imageViewportCls = classNames(`${prefixCls}-viewport`, className, {
  //   [`${prefixCls}-uploading`]: status !== 'success',
  // });

  const statusTextCls = classNames(`${prefixCls}-status-text`, {
    isError: status === 'error',
  });

  const progressCls = classNames(`${prefixCls}-progress`, {
    isError: status === 'error',
  });

  const uploaderLayout = (
    <>
      <div className={`${prefixCls}-uploading`}>
        <img
          src={src}
          className={`${prefixCls}-preview`}
          alt={locale['eeeditor.image.alt'] || 'eeeditor.image.alt'}
        />
      </div>
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

  const imageViewportCls = classNames(`${prefixCls}-viewport`, className);

  const figcaptionCls = classNames(`${prefixCls}-figcaption`, {
    [`${prefixCls}-figcaption-placeholder`]: !!!figcaption,
    [`${prefixCls}-figcaption-is-editing`]: figcaptionEditPopoverVisible,
  });

  const imageLayout = (
    <>
      <div className={`${prefixCls}-wrapper`} data-container="true">
        <div
          className={imageViewportCls}
          style={{
            width: cropTl ? `${cropR.x - cropL.x}px` : 'auto',
            height: cropTl ? `${cropB.y - cropT.y}px` : 'auto',
          }}
        >
          <img
            src={src}
            className={`${prefixCls}`}
            alt={locale['eeeditor.image.alt'] || 'eeeditor.image.alt'}
            style={{
              position: 'relative',
              top: cropTl ? `${-(cropTl.y + OFFSET)}px` : 0,
              left: cropTl ? `${-(cropTl.x + OFFSET)}px` : 0,
            }}
          />
        </div>
      </div>
      {shouldShowFigcaption() && (
        <figcaption className={figcaptionCls} onMouseUp={onFigcaptionMouseUp}>
          {figcaption ||
            locale['eeeditor.image.figcaption.placeholder'] ||
            'eeeditor.image.figcaption.placeholder'}
        </figcaption>
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
