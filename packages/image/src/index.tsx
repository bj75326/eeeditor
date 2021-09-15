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

export * from './locale';

export interface ImageEntityData {
  src: string;
  uid: string;
  status: 'uploading' | 'error' | 'success';
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
    | ((file: RcFile, store: ImagePluginStore) => string)
    | ((file: RcFile, store: ImagePluginStore) => PromiseLike<string>);
  data?: object | ((file: UploadFile<T>, store: ImagePluginStore) => object);
  beforeUpload?: (
    file: RcFile,
    FileList: RcFile[],
    store: ImagePluginStore,
  ) => BeforeUploadValueType | Promise<BeforeUploadValueType>;
  onChange?: (info: UploadChangeParam, store: ImagePluginStore) => void;
  onDrop?: (
    event: React.DragEvent<HTMLDivElement>,
    store: ImagePluginStore,
  ) => void;
  onPreview?: (file: UploadFile<T>, store: ImagePluginStore) => void;
  onDownload?: (file: UploadFile<T>, store: ImagePluginStore) => void;
  onRemove?: (
    file: UploadFile<T>,
    store: ImagePluginStore,
  ) => void | boolean | Promise<void | boolean>;
  customRequest?: (
    options: RcCustomRequestOptions,
    store: ImagePluginStore,
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
// const getFileName = (name: string):string => {

// };
const defaultUploadProps: ImageUploadProps = {
  action: (file) =>
    `https://gitee.com/api/v5/repos/bj75326/image-bed/contents/images/${file.name}`,
  data: (file) => {
    console.log('data file ', file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        console.log(e.target.result);
        resolve({
          access_token: '43ffba06ed1a8f2aa2976fc7c1e7009c',
          owner: 'bj75326',
          repo: 'image-bed',
          path: `images/${file.name}`,
          message: 'upload image',
          content: (e.target.result as string).replace(
            'data:image/png;base64,',
            '',
          ),
        });
      };

      reader.readAsDataURL(
        file.originFileObj ? file.originFileObj : (file as RcFile),
      );
    });
  },
  showUploadList: false,
  beforeUpload: (file, _, store) => {
    const { getEditorState, setEditorState, addImage } =
      store.getItem('imagePluginMethods');
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
  onChange: (info, store) => {
    console.log(info);
    // if (info.file.status === 'done') {
    //   setEditorState(
    //     updateImage(getEditorState(), {
    //       src: info.file.response.linkurl as string,
    //       uid: info.file.uid,
    //       status: 'success',
    //     }),
    //   );
    // }
  },
};

// todo
const getUploadProps = (
  imageUploadProps: ImageUploadProps,
  store: ImagePluginStore,
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
        : (file: RcFile) => action(file, store) as string;
  }
  if (data) {
    uploadProps.data =
      typeof data === 'object' ? data : (file: UploadFile) => data(file, store);
  }

  if (beforeUpload) {
    uploadProps.beforeUpload = (file: RcFile, FileList: RcFile[]) =>
      beforeUpload(file, FileList, store);
  }

  if (onChange) {
    uploadProps.onChange = (info: UploadChangeParam) => onChange(info, store);
  }

  if (onDrop) {
    uploadProps.onDrop = (event: React.DragEvent<HTMLDivElement>) =>
      onDrop(event, store);
  }

  if (onPreview) {
    uploadProps.onPreview = (file: UploadFile) => onPreview(file, store);
  }

  if (onDownload) {
    uploadProps.onDownload = (file: UploadFile) => onDownload(file, store);
  }

  if (onRemove) {
    uploadProps.onRemove = (file: UploadFile) => onRemove(file, store);
  }

  if (customRequest) {
    uploadProps.customRequest = (options: RcCustomRequestOptions) =>
      customRequest(options, store);
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

  const uploadProps = getUploadProps(imageUploadProps, store);

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
      store.updateItem('imagePluginMethods', {
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
          component: null,
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
