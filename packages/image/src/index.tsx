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

export interface StoreItemMap {
  pluginMethods?: PluginMethods;
  // entityKeyMap 用来存储 uid 与其对应的 entityKey
  entityKeyMap?: Record<string, string>;
}

export type ImagePluginStore = Store<StoreItemMap>;

// antd upload props function 传入 pluginMethods
type BeforeUploadValueType = void | boolean | string | Blob | File;
export type ImagePluginUploadProps<T = any> = UploadProps<T> & {
  action?:
    | string
    | ((file: RcFile, pluginMethods: PluginMethods) => string)
    | ((file: RcFile, pluginMethods: PluginMethods) => PromiseLike<string>);
  data?:
    | object
    | ((file: UploadFile<T>, pluginMethods: PluginMethods) => object);
  beforeUpload?: (
    file: RcFile,
    FileList: RcFile[],
    pluginMethods: PluginMethods,
  ) => BeforeUploadValueType | Promise<BeforeUploadValueType>;
  onChange?: (info: UploadChangeParam, pluginMethods: PluginMethods) => void;
  onDrop?: (
    event: React.DragEvent<HTMLDivElement>,
    pluginMethods: PluginMethods,
  ) => void;
  onPreview?: (file: UploadFile<T>, pluginMethods: PluginMethods) => void;
  onDownload?: (file: UploadFile<T>, pluginMethods: PluginMethods) => void;
  onRemove?: (
    file: UploadFile<T>,
    pluginMethods: PluginMethods,
  ) => void | boolean | Promise<void | boolean>;
  customRequest?: (
    options: RcCustomRequestOptions,
    pluginMethods: PluginMethods,
  ) => void;
};

interface ImagePluginConfig {
  // todo
  uploadProps: ImagePluginUploadProps;
  prefixCls?: string;
  entityType?: string;
  decorator?: unknown;
  focusable?: boolean;
  languages?: Languages;
}

// test
// const uploadSetup = {
//   access_token: "43ffba06ed1a8f2aa2976fc7c1e7009c",
//   owner: "bj75326",
//   repo: "image-bed",
//   path: "images",
//   message: "upload image",
//   content: "iVBORw0KGgoAAAANSUhEUgAAAcwAAADUBAMAAADjBw73AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAVUExURf///+vr6xaQ/+3t7eTy/zie/1Kp/6ECjV0AAADnSURBVHja7dq9CYAwFEbRFC4Q3EBwAHEBCycQdAP3X8EyhYKVmJ9zNrh8jXkYAgDAg7ViqbI792odS8rchmqNMmXKlClTpkyZMmXKlClTpkyZMmXKlClTpkyZMmXKlClTpkyZMmXKlClTpkyZ32S28aNpI78NAwAAAAAAwM0UC9HLfBetmRdrWtOa1rSmNf9fcy6GD3MAANxpvTfdaa3pemBNa1rTmtZ0p3WnBQAAd1rvTXda1wNrWtOa1rSmNd1pAQDAnTbPt4XMvN6bjawZrWlNa1rTmtasZU0XVgAAAAAAAAAAIFcXi9yX4VfJc8IAAAAASUVORK5CYII=",
// };

// const defaultUploadProps: UploadProps = {
//   // name: 'file',
//   action: (file) => `https://gitee.com/api/v5/repos/bj75326/image-bed/contents/images/${file.name}`,
//   data: uploadSetup,
//   showUploadList: false,
//   beforeUpload: (file) => {
//     const getEditorState = store.getItem('getEditorState');
//     const setEditorState = store.getItem('setEditorState');
//     const reader = new FileReader();
//     reader.onload = (e: ProgressEvent<FileReader>) => {
//       // test
//       // uploadSetup.content = e.target.result as string;

//       setEditorState(
//         addImage(getEditorState(), {
//           src: e.target.result as string,
//           uid: file.uid,
//           status: 'uploading',
//         }),
//       );
//     };
//     reader.readAsDataURL(file);
//   },
//   onChange: (info) => {
//     const getEditorState = store.getItem('getEditorState');
//     const setEditorState = store.getItem('setEditorState');
//     if (info.file.status === 'done') {
//       setEditorState(
//         updateImage(getEditorState(), {
//           src: info.file.response.linkurl as string,
//           uid: info.file.uid,
//           status: 'success',
//         }),
//       );
//     }
//   },
// };

const getUploadProps = (
  uploadProps: ImagePluginUploadProps,
  store: ImagePluginStore,
): UploadProps => {
  const pluginMethods = store.getItem('pluginMethods');

  return {};
};

const createImagePlugin = ({
  prefixCls,
  entityType = 'image',
  decorator,
  focusable = true,
  languages = lang,
  uploadProps,
}: ImagePluginConfig): EditorPlugin & {
  ImageButton: ComponentType<ImageButtonProps>;
} => {
  const store = createStore<StoreItemMap>({
    entityKeyMap: {},
  });

  const addImage = getAddImage(entityType, store);
  const updateImage = getUpdateImage(store);

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
      store.updateItem('pluginMethods', pluginMethods);
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
