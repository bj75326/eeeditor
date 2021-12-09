import React, { ComponentType, ReactNode } from 'react';
import {
  EditorPlugin,
  ContentBlock,
  EditorState,
  PluginMethods,
  focusDecorator,
  BlockFocusDecoratorProps,
  ToolbarPopover,
  ToolbarPopoverProps,
} from '@eeeditor/editor';
import lang, { Languages, zhCN, Locale } from './locale';
import {
  UploadProps,
  RcFile,
  UploadFile,
  UploadChangeParam,
} from 'antd/lib/upload/interface';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import getAddImage from './modifiers/addImage';
import getUpdateImage from './modifiers/updateImage';
import { Store, createStore } from '@draft-js-plugins/utils';
import DefaultImageButton, {
  ImageButtonExtraProps,
  ImageButtonProps,
} from './components/ImageButton';
import DefaultImage, { ImageExtraProps, ImageProps } from './components/Image';
import classNames from 'classnames';
import DefaultImageFigcaptionEditPopover, {
  ImageFigcaptionEditPopoverProps,
} from './components/ImageFigcaptionEditPopover';
import {
  defaultAlignCenterIcon,
  defaultAlignLeftIcon,
  defaultAlignRightIcon,
} from '@eeeditor/buttons';
import { Tooltip } from 'antd';
import { cropIcon } from './assets/extraIcons';

export * from './locale';

export interface ImageEntityData {
  src?: string;
}

export interface ImagePluginMethods {
  addImage: (
    editorState: EditorState,
    data: ImageEntityData,
    file: RcFile,
  ) => EditorState;
  updateImage: (
    editorState: EditorState,
    data: ImageEntityData,
    uid: string,
  ) => EditorState;
}

export interface StoreItemMap {
  imagePluginMethods?: ImagePluginMethods;
  pluginMethods?: PluginMethods;
  // entityKeyMap 用来存储 uid 与其对应的 entityKey
  entityKeyMap?: Record<string, string>;
  // fileMap 用来存储 entity 与其对应的 Rcfile
  fileMap?: Record<string, RcFile>;
  // statusMap 用来存储 uid 与其对应的 image upload status
  statusMap?: Record<string, 'uploading' | 'success' | 'error'>;
  // 控制 figcaption edit popover 的显示隐藏
  figcaptionEditPopoverVisible?: boolean;

  // 控制 toolbar popover 的显示隐藏
  toolbarPopoverOffsetKey?: string;

  // 获取 image block props
  getBlockProps?: () => Partial<ImageProps>;
}

export type ImagePluginStore = Store<StoreItemMap>;

export type BeforeUploadValueType = void | boolean | string | Blob | File;
export type ImageUploadProps<T = any> = Pick<
  UploadProps<T>,
  'name' | 'method' | 'headers' | 'withCredentials'
> & {
  action?:
    | string
    | ((
        file: RcFile,
        imagePluginMethods: ImagePluginMethods,
        pluginMethods: PluginMethods,
      ) => string)
    | ((
        file: RcFile,
        imagePluginMethods: ImagePluginMethods,
        pluginMethods: PluginMethods,
      ) => PromiseLike<string>);
  data?:
    | object
    | ((
        file: UploadFile<T>,
        imagePluginMethods: ImagePluginMethods,
        pluginMethods: PluginMethods,
      ) => object);
  customRequest?: (
    options: RcCustomRequestOptions,
    imagePluginMethods: ImagePluginMethods,
    pluginMethods: PluginMethods,
  ) => void;
  beforeUpload?: (
    file: RcFile,
    fileList: RcFile[],
    imagePluginMethdos: ImagePluginMethods,
    pluginMethods: PluginMethods,
  ) => BeforeUploadValueType | Promise<BeforeUploadValueType>;
  onChange?: (
    info: UploadChangeParam,
    imagePluginMethods: ImagePluginMethods,
    pluginMethods: PluginMethods,
  ) => void;
  imagePath?: string[];
};

interface ImagePluginConfig {
  imageUploadProps: ImageUploadProps;
  prefixCls?: string;
  imageClassName?: string;
  imageFigcaptionEditPopoverCls?: string;
  imageToolbarPopoverCls?: string;
  entityType?: string;
  decorator?: unknown;
  focusable?: boolean;
  languages?: Languages;
  imageComponent?: ComponentType<ImageProps & ImageExtraProps>;
  imageButtonComponent?: ComponentType<
    ImageButtonProps & ImageButtonExtraProps
  >;
  imageFigcaptionEditPopoverComponent?: ComponentType<ImageFigcaptionEditPopoverProps>;
  imageToolbarPopoverComponent?: ComponentType<ToolbarPopoverProps>;
}

// todo 开发使用配置 必须删除！！！
// todo 开发使用配置 必须删除！！！
// todo 开发使用配置 必须删除！！！
const getFileName = (file: RcFile): string => {
  const { name, uid } = file;
  return `${uid}.${name.split('.').pop()}`;
};
const defaultUploadProps: ImageUploadProps = {
  action: (file) =>
    `https://gitee.com/api/v5/repos/bj75326/image-bed/contents/images/${getFileName(
      file,
    )}`,
  data: (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        resolve({
          access_token: '43ffba06ed1a8f2aa2976fc7c1e7009c',
          owner: 'bj75326',
          repo: 'image-bed',
          path: `images/${getFileName(
            file.originFileObj ? file.originFileObj : (file as RcFile),
          )}`,
          message: 'upload image',
          content: (e.target.result as string).replace(
            'data:image/png;base64,',
            '',
          ),
        });
      };
      // 异常处理省略
      reader.readAsDataURL(
        file.originFileObj ? file.originFileObj : (file as RcFile),
      );
    });
  },
  imagePath: ['content', 'download_url'],
};
// todo 开发使用配置 必须删除！！！
// todo 开发使用配置 必须删除！！！
// todo 开发使用配置 必须删除！！！

// imageUploadProps 转化为 antd UploadProps
const getUploadProps = (
  imageUploadProps: ImageUploadProps,
  store: ImagePluginStore,
  retry: boolean,
  languages: Languages,
): UploadProps => {
  const imagePluginMethods = store.getItem('imagePluginMethods');
  const pluginMethods = store.getItem('pluginMethods');
  const { addImage, updateImage } = imagePluginMethods;
  const { getEditorState, setEditorState, getProps, getEditorRef } =
    pluginMethods;

  const { locale: currLocale } = getProps();
  let locale: Locale = zhCN;
  if (currLocale && languages) {
    locale = languages[currLocale] || zhCN;
  }

  const {
    action,
    data,
    customRequest,
    beforeUpload,
    onChange,
    imagePath,
    ...otherProps
  } = imageUploadProps;

  const uploadProps: UploadProps = {
    ...otherProps,
  };
  // accept 限制上传文件类型
  uploadProps.accept = 'image/*';
  // antd upload 组件默认显示 upload list
  uploadProps.showUploadList = false;

  if (retry) {
    uploadProps.beforeUpload = async (file: RcFile, _) => {
      let transformedFile: BeforeUploadValueType = file;
      if (beforeUpload) {
        try {
          transformedFile = await beforeUpload(
            file,
            _,
            imagePluginMethods,
            pluginMethods,
          );
        } catch (e) {
          // Rejection will also trade as false
          transformedFile = false;
        }
      }
      return transformedFile;
    };
  } else {
    uploadProps.beforeUpload = async (file: RcFile, _) => {
      let transformedFile: BeforeUploadValueType = file;
      if (beforeUpload) {
        try {
          transformedFile = await beforeUpload(
            file,
            _,
            imagePluginMethods,
            pluginMethods,
          );
        } catch (e) {
          // Rejection will also trade as false
          transformedFile = false;
        }
      }
      if (transformedFile === false) return false;

      setEditorState(
        addImage(
          getEditorState(),
          {
            src: URL.createObjectURL(file),
          },
          file,
        ),
      );

      return transformedFile;
    };
  }

  uploadProps.onChange = (info: UploadChangeParam) => {
    if (onChange) {
      onChange(info, imagePluginMethods, pluginMethods);
    }
    const statusMap = store.getItem('statusMap');
    if (info.file.status === 'done' || info.file.status === 'success') {
      // updateImage 只更新了 entity data, 所以返回的 editorState 并不会触发重新渲染
      // 对于这种 contentState 没有变化，entity data 发生变化需要同步的情况，
      // eeeditor 提供了 getEditorRef().forceSync 来帮助 app 判断是否需要强制同步
      getEditorRef().forceSync = true;

      setEditorState(
        updateImage(
          getEditorState(),
          {
            src: imagePath.reduce(
              (currentObj, path) => currentObj[path],
              info.file.response,
            ),
          },
          info.file.uid,
        ),
      );

      store.updateItem('statusMap', {
        ...statusMap,
        [info.file.uid]: 'success',
      });
    } else if (info.file.status === 'uploading') {
      console.log('onchange uploading run');
      store.updateItem('statusMap', {
        ...statusMap,
        [info.file.uid]: 'uploading',
      });
    } else if (info.file.status === 'error') {
      store.updateItem('statusMap', {
        ...statusMap,
        [info.file.uid]: 'error',
      });
    }
  };

  if (action) {
    uploadProps.action =
      typeof action === 'string'
        ? action
        : (file: RcFile) =>
            action(file, imagePluginMethods, pluginMethods) as string;
  }
  if (data) {
    uploadProps.data =
      typeof data === 'object'
        ? data
        : (file: UploadFile) => data(file, imagePluginMethods, pluginMethods);
  }
  if (customRequest) {
    uploadProps.customRequest = (options: RcCustomRequestOptions) =>
      customRequest(options, imagePluginMethods, pluginMethods);
  }

  return uploadProps as UploadProps;
};

const createImagePlugin = ({
  prefixCls,
  imageClassName,
  imageFigcaptionEditPopoverCls,
  imageToolbarPopoverCls,
  entityType = 'image',
  decorator,
  focusable = true,
  languages = lang,
  imageUploadProps = defaultUploadProps,
  imageComponent: ImageComponent = DefaultImage,
  imageButtonComponent: ImageButtonComponent = DefaultImageButton,
  imageFigcaptionEditPopoverComponent:
    ImageFigcaptionEditPopoverComponent = DefaultImageFigcaptionEditPopover,
  imageToolbarPopoverComponent: ImageToolbarPopoverComponent = ToolbarPopover,
}: ImagePluginConfig): EditorPlugin & {
  ImageButton: ComponentType<ImageButtonProps>;
} => {
  const store = createStore<StoreItemMap>({
    figcaptionEditPopoverVisible: false,
    toolbarPopoverOffsetKey: '',
    entityKeyMap: {},
    fileMap: {},
    statusMap: {},
  });

  const addImage = getAddImage(entityType, store);
  const updateImage = getUpdateImage(store);

  let uploadProps: UploadProps = {};
  let retryUploadProps: UploadProps = {};

  const ImageButton: React.FC<ImageButtonProps> = (props) => (
    <ImageButtonComponent
      {...props}
      languages={languages}
      uploadProps={uploadProps}
    />
  );

  let Image: React.FC<ImageProps> = (props) => {
    const { className: decoratorCls } = props;
    const className = classNames(decoratorCls, imageClassName);
    return (
      <ImageComponent
        {...props}
        prefixCls={prefixCls}
        languages={languages}
        uploadProps={retryUploadProps}
        store={store}
        className={className}
      />
    );
  };

  // focusable === true 则需要用 built-in/focus 提供的 decorator 包装之后再渲染
  let FocusableImage = null;
  if (focusable) {
    FocusableImage = focusDecorator(
      Image as unknown as React.FC<BlockFocusDecoratorProps>,
    );
    if (typeof decorator === 'function') {
      FocusableImage = decorator(FocusableImage);
    }
  }
  if (typeof decorator === 'function') {
    Image = decorator(Image);
  }

  const ImageFigcaptionEditPopover: React.FC = () => (
    <ImageFigcaptionEditPopoverComponent
      prefixCls={prefixCls}
      className={imageFigcaptionEditPopoverCls}
      languages={languages}
      store={store}
    />
  );

  const isImageBlock = (
    block: ContentBlock,
    editorState: EditorState,
  ): boolean => {
    if (block.getType() === 'atomic') {
      const contentState = editorState.getCurrentContent();
      const entity = block.getEntityAt(0);
      if (!entity) return false;
      return contentState.getEntity(entity).getType() === entityType;
    }
    return false;
  };

  return {
    initialize(pluginMethods: PluginMethods) {
      store.updateItem('imagePluginMethods', {
        addImage,
        updateImage,
      });

      store.updateItem('pluginMethods', pluginMethods);

      uploadProps = getUploadProps(imageUploadProps, store, false, languages);
      retryUploadProps = getUploadProps(
        imageUploadProps,
        store,
        true,
        languages,
      );
    },

    blockRendererFn(block, { getEditorState }) {
      if (isImageBlock(block, getEditorState())) {
        return {
          component: focusable ? FocusableImage : Image,
          editable: false,
          props: {
            focusable,
          },
        };
      }
      return null;
    },

    blockStyleFn(block, { getEditorState }) {
      if (isImageBlock(block, getEditorState())) {
        return 'picture';
      }
      return '';
    },

    ImageButton,

    suffix: () => {
      const { getProps } = store.getItem('pluginMethods');
      let locale: Locale = zhCN;
      if (getProps && languages) {
        const { locale: currLocale } = getProps();
        locale = languages[currLocale] || zhCN;
      }

      const getTipTitle = (name: string): ReactNode => (
        <span className={`${prefixCls}-tip`}>
          <span className={`${prefixCls}-tip-name`}>
            {locale[name] || name}
          </span>
        </span>
      );

      return focusable ? (
        <>
          <ImageFigcaptionEditPopover />
          <ImageToolbarPopoverComponent
            prefixCls={prefixCls}
            className={imageToolbarPopoverCls}
            store={store}
          >
            <Tooltip
              title={getTipTitle('eeeditor.image.crop')}
              overlayClassName={`${prefixCls}-tip-wrapper`}
            >
              <span className={`${prefixCls}-popover-button`}>{cropIcon}</span>
            </Tooltip>
          </ImageToolbarPopoverComponent>
        </>
      ) : null;
    },
  };
};

export default createImagePlugin;
