import React, { ComponentType } from 'react';
import {
  EditorPlugin,
  ContentBlock,
  EditorState,
  EntityInstance,
  PluginMethods,
} from '@eeeditor/editor';
import lang, { Languages } from './locale';
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
import DefaultImageUploader, {
  ImageUploaderProps,
} from './components/ImageUploader';
import DefaultImageButton, { ImageButtonProps } from './components/ImageButton';
import DefaultImage, { ImageProps } from './components/Image';

export * from './locale';

export interface ImageEntityData {
  uid: string;
  src?: string;
  status?: 'uploading' | 'error' | 'success';
}

export interface ImagePluginMethods extends PluginMethods {
  addImage: (editorState: EditorState, data: ImageEntityData) => EditorState;
  updateImage: (editorState: EditorState, data: ImageEntityData) => EditorState;
}

export interface StoreItemMap {
  imagePluginMethods?: ImagePluginMethods;
  // entityKeyMap 用来存储 uid 与其对应的 entityKey
  entityKeyMap?: Record<string, string>;
}

export type ImagePluginStore = Store<StoreItemMap>;

// antd upload props function 传入 ImagePluginMethods
type BeforeUploadValueType = void | boolean | string | Blob | File;
export type ImageUploadProps<T = any> = Omit<
  UploadProps<T>,
  | 'action'
  | 'data'
  | 'beforeUpload'
  | 'onChange'
  | 'onDrop'
  | 'onPreview'
  | 'onDownload'
  | 'onRemove'
  | 'customRequest'
> & {
  action?:
    | string
    | ((file: RcFile, imagePluginMethods: ImagePluginMethods) => string)
    | ((
        file: RcFile,
        imagePluginMethods: ImagePluginMethods,
      ) => PromiseLike<string>);
  data?:
    | object
    | ((file: UploadFile<T>, imagePluginMethods: ImagePluginMethods) => object);
  beforeUpload?: (
    file: RcFile,
    FileList: RcFile[],
    imagePluginMethods: ImagePluginMethods,
  ) => BeforeUploadValueType | Promise<BeforeUploadValueType>;
  onChange?: (
    info: UploadChangeParam,
    imagePluginMethods: ImagePluginMethods,
  ) => void;
  onDrop?: (
    event: React.DragEvent<HTMLDivElement>,
    imagePluginMethods: ImagePluginMethods,
  ) => void;
  onPreview?: (
    file: UploadFile<T>,
    imagePluginMethods: ImagePluginMethods,
  ) => void;
  onDownload?: (
    file: UploadFile<T>,
    imagePluginMethods: ImagePluginMethods,
  ) => void;
  onRemove?: (
    file: UploadFile<T>,
    imagePluginMethods: ImagePluginMethods,
  ) => void | boolean | Promise<void | boolean>;
  customRequest?: (
    options: RcCustomRequestOptions,
    imagePluginMethods: ImagePluginMethods,
  ) => void;
};

interface ImagePluginConfig {
  // todo
  imageUploadProps?: ImageUploadProps;
  prefixCls?: string;
  entityType?: string;
  decorator?: unknown;
  focusable?: boolean;
  languages?: Languages;
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
        console.log(e.target.result);
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
  showUploadList: false,
  beforeUpload: (file, _, imagePluginMethods) => {
    const { getEditorState, setEditorState, addImage } = imagePluginMethods;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      setEditorState(
        addImage(getEditorState(), {
          src: e.target.result as string,
          uid: file.uid,
          status: 'uploading',
        }),
      );
    };
    reader.readAsDataURL(file);
  },
  onChange: (info, imagePluginMethods) => {
    const { updateImage, setEditorState, getEditorState } = imagePluginMethods;
    if (info.file.status === 'done' || info.file.status === 'success') {
      setEditorState(
        updateImage(getEditorState(), {
          uid: info.file.uid,
          src:
            info.file.response.content &&
            info.file.response.content.download_url,
          status: 'success',
        }),
      );
    } else if (info.file.status === 'error') {
      setEditorState(
        updateImage(getEditorState(), {
          uid: info.file.uid,
          status: 'error',
        }),
      );
    }
  },
};
// todo 开发使用配置 必须删除！！！
// todo 开发使用配置 必须删除！！！
// todo 开发使用配置 必须删除！！！

// todo
const getUploadProps = (
  imageUploadProps: ImageUploadProps,
  imagePluginMethods: ImagePluginMethods,
): UploadProps => {
  const {
    action,
    data,
    beforeUpload,
    onChange,
    onDrop,
    onPreview,
    onDownload,
    onRemove,
    customRequest,
  } = imageUploadProps;
  const uploadProps = { ...imageUploadProps };
  if (action) {
    uploadProps.action =
      typeof action === 'string'
        ? action
        : (file: RcFile) => action(file, imagePluginMethods) as string;
  }
  if (data) {
    uploadProps.data =
      typeof data === 'object'
        ? data
        : (file: UploadFile) => data(file, imagePluginMethods);
  }

  if (beforeUpload) {
    uploadProps.beforeUpload = (file: RcFile, FileList: RcFile[]) =>
      beforeUpload(file, FileList, imagePluginMethods);
  }

  if (onChange) {
    uploadProps.onChange = (info: UploadChangeParam) =>
      onChange(info, imagePluginMethods);
  }

  if (onDrop) {
    uploadProps.onDrop = (event: React.DragEvent<HTMLDivElement>) =>
      onDrop(event, imagePluginMethods);
  }

  if (onPreview) {
    uploadProps.onPreview = (file: UploadFile) =>
      onPreview(file, imagePluginMethods);
  }

  if (onDownload) {
    uploadProps.onDownload = (file: UploadFile) =>
      onDownload(file, imagePluginMethods);
  }

  if (onRemove) {
    uploadProps.onRemove = (file: UploadFile) =>
      onRemove(file, imagePluginMethods);
  }

  if (customRequest) {
    uploadProps.customRequest = (options: RcCustomRequestOptions) =>
      customRequest(options, imagePluginMethods);
  }

  return uploadProps as UploadProps;
};

const createImagePlugin = ({
  prefixCls,
  entityType = 'image',
  decorator,
  focusable = true,
  languages = lang,
  imageUploadProps = defaultUploadProps,
}: ImagePluginConfig): EditorPlugin & {
  ImageButton: ComponentType<ImageButtonProps>;
} => {
  const store = createStore<StoreItemMap>({
    entityKeyMap: {},
  });

  const addImage = getAddImage(entityType, store);
  const updateImage = getUpdateImage(store);

  let uploadProps: UploadProps = {};

  let ImageUploader: React.FC<ImageUploaderProps> = (props) => (
    <DefaultImageUploader
      {...props}
      prefixCls={prefixCls}
      languages={languages}
      uploadProps={uploadProps}
    />
  );

  const ImageButton: React.FC<ImageButtonProps> = (props) => (
    <DefaultImageButton
      {...props}
      languages={languages}
      uploadProps={uploadProps}
    />
  );

  const Image: React.FC<ImageProps> = (props) => (
    <DefaultImage {...props} prefixCls={prefixCls} languages={languages} />
  );

  const getImageEntity = (
    block: ContentBlock,
    editorState: EditorState,
  ): EntityInstance => {
    if (block.getType() === 'atomic') {
      const contentState = editorState.getCurrentContent();
      const entityKey = block.getEntityAt(0);
      if (!entityKey) return null;
      const entity = contentState.getEntity(entityKey);
      if (entity && entity.getType() === entityType) {
        return entity;
      }
      return null;
    }
    return null;
  };

  return {
    initialize(pluginMethods: PluginMethods) {
      uploadProps = getUploadProps(imageUploadProps, {
        ...pluginMethods,
        addImage,
        updateImage,
      });
    },

    blockRendererFn(block, { getEditorState }) {
      const entity = getImageEntity(block, getEditorState());
      if (entity) {
        if (
          entity.getData()['status'] === 'uploading' ||
          entity.getData()['status'] === 'error'
        ) {
          return {
            component: ImageUploader,
            editable: false,
          };
        }
        return {
          // todo
          component: Image,
          editable: false,
        };
      }
      return null;
    },

    blockStyleFn(block, { getEditorState }) {
      const entity = getImageEntity(block, getEditorState());
      if (entity) {
        if (entity.getData()['upload']) {
          return 'image-uploader';
        }
        return 'image';
      }
      return '';
    },

    ImageButton,
  };
};

export default createImagePlugin;
