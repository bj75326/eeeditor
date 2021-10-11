import React, { ComponentType } from 'react';
import {
  EditorPlugin,
  ContentBlock,
  EditorState,
  EntityInstance,
  PluginMethods,
  focusDecorator,
  BlockFocusDecoratorProps,
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
import DefaultImageUploader, {
  ImageUploaderProps,
} from './components/ImageUploader';
import DefaultImageButton, { ImageButtonProps } from './components/ImageButton';
import DefaultImage, { ImageProps } from './components/Image';
import { message } from 'antd';

export * from './locale';

export interface ImageEntityData {
  // uid: string;
  src?: string;
  // status?: 'uploading' | 'error' | 'success';
  // 上传图片时保存图片 blob 对象，供上传失败后重试使用
  // file?: RcFile;
}

export interface ImagePluginMethods extends PluginMethods {
  addImage: (
    editorState: EditorState,
    data: ImageEntityData,
    uid: string,
  ) => EditorState;
  updateImage: (
    editorState: EditorState,
    data: ImageEntityData,
    uid: string,
  ) => EditorState;
}

export interface StoreItemMap {
  imagePluginMethods?: ImagePluginMethods;
  // entityKeyMap 用来存储 uid 与其对应的 entityKey
  entityKeyMap?: Record<string, string>;
}

export type ImagePluginStore = Store<StoreItemMap>;

export type BeforeUploadValueType = void | boolean | string | Blob | File;
export type ImageUploadProps<T = any> = Pick<
  UploadProps<T>,
  'name' | 'method' | 'headers' | 'withCredentials'
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
  customRequest?: (
    options: RcCustomRequestOptions,
    imagePluginMethods: ImagePluginMethods,
  ) => void;
  beforeUpload?: (
    file: RcFile,
    FileList: RcFile[],
    imagePluginMethdos: ImagePluginMethods,
  ) => BeforeUploadValueType | Promise<BeforeUploadValueType>;
  onChange?: (
    info: UploadChangeParam,
    imagePluginMethods: ImagePluginMethods,
  ) => void;
  imagePath?: string[];
};

interface ImagePluginConfig {
  imageUploadProps: ImageUploadProps;
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
        resolve({
          access_token: '43ffba06ed1a8f2aa2976fc7c1e7009c_',
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
  imagePluginMethods: ImagePluginMethods,
  retry: boolean,
  languages: Languages,
): UploadProps => {
  const { getEditorState, setEditorState, getProps, addImage, updateImage } =
    imagePluginMethods;
  const { prefixCls, locale: currLocale } = getProps();
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
          transformedFile = await beforeUpload(file, _, imagePluginMethods);
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
          transformedFile = await beforeUpload(file, _, imagePluginMethods);
        } catch (e) {
          // Rejection will also trade as false
          transformedFile = false;
        }
      }
      if (transformedFile === false) return false;

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          setEditorState(
            addImage(
              getEditorState(),
              {
                src: e.target.result as string,
              },
              file.uid,
            ),
          );
          resolve(transformedFile);
        };
        reader.onerror = () => {
          message.open({
            content:
              locale['eeeditor.image.read.error.msg'] ||
              'eeeditor.image.read.error.msg',
            type: 'info',
            duration: 3,
            className: `${prefixCls}-message`,
          });
          resolve(false);
        };
        reader.readAsDataURL(file);
      });
    };
  }

  uploadProps.onChange = (info: UploadChangeParam) => {
    if (onChange) {
      onChange(info, imagePluginMethods);
    }

    if (info.file.status === 'done' || info.file.status === 'success') {
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
    } else if (info.file.status === 'uploading') {
      // setEditorState(
      //   updateImage(getEditorState(), {
      //     uid: info.file.uid,
      //     status: 'uploading',
      //   }),
      // );
    } else if (info.file.status === 'error') {
      // setEditorState(
      //   updateImage(getEditorState(), {
      //     uid: info.file.uid,
      //     status: 'error',
      //   }),
      // );
    }
  };

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
  let retryUploadProps: UploadProps = {};

  let ImageUploader: React.FC<ImageUploaderProps> = (props) => (
    <DefaultImageUploader
      {...props}
      prefixCls={prefixCls}
      languages={languages}
      uploadProps={retryUploadProps}
    />
  );
  let FocusableUploader = focusDecorator(
    ImageUploader as unknown as React.FC<BlockFocusDecoratorProps>,
  );

  const ImageButton: React.FC<ImageButtonProps> = (props) => (
    <DefaultImageButton
      {...props}
      languages={languages}
      uploadProps={uploadProps}
    />
  );

  let Image: React.FC<ImageProps> = (props) => (
    <DefaultImage {...props} prefixCls={prefixCls} languages={languages} />
  );

  // todo
  // const getImageEntity = (
  //   block: ContentBlock,
  //   editorState: EditorState,
  // ): EntityInstance => {
  //   if (block.getType() === 'atomic') {
  //     const contentState = editorState.getCurrentContent();
  //     const entityKey = block.getEntityAt(0);
  //     if (!entityKey) return null;
  //     const entity = contentState.getEntity(entityKey);
  //     if (entity && entity.getType() === entityType) {
  //       return entity;
  //     }
  //     return null;
  //   }
  //   return null;
  // };

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
      uploadProps = getUploadProps(
        imageUploadProps,
        {
          ...pluginMethods,
          addImage,
          updateImage,
        },
        false,
        languages,
      );
      retryUploadProps = getUploadProps(
        imageUploadProps,
        {
          ...pluginMethods,
          addImage,
          updateImage,
        },
        true,
        languages,
      );
    },

    blockRendererFn(block, { getEditorState }) {
      // const entity = getImageEntity(block, getEditorState());
      // if (entity) {
      //   if (
      //     entity.getData()['status'] === 'uploading' ||
      //     entity.getData()['status'] === 'error'
      //   ) {
      //     return {
      //       component: FocusableUploader, // ImageUploader
      //       editable: false,
      //     };
      //   }
      //   return {
      //     component: Image,
      //     editable: false,
      //   };
      // }
      // return null;
      if (isImageBlock(block, getEditorState())) {
        return {
          component: Image,
          editable: false,
        };
      }
      return null;
    },

    blockStyleFn(block, { getEditorState }) {
      // const entity = getImageEntity(block, getEditorState());
      // if (entity) {
      //   if (entity.getData()['upload']) {
      //     return 'image-uploader';
      //   }
      //   return 'image';
      // }
      // return '';
      if (isImageBlock(block, getEditorState())) {
        return 'image';
      }
      return '';
    },

    ImageButton,
  };
};

export default createImagePlugin;
