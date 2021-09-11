import React, { ComponentType } from 'react';
import {
  EditorPlugin,
  ContentBlock,
  EditorState,
  EntityInstance,
} from '@eeeditor/editor';
import lang, { Languages } from './locale';
import { UploadProps } from 'antd';
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
  getEditorState?(): EditorState;
  setEditorState?(editorState: EditorState): void;
  // entityKeyMap 用来存储 uid 与其对应的 entityKey
  entityKeyMap?: Record<string, string>;
}

export type ImagePluginStore = Store<StoreItemMap>;

interface ImagePluginConfig {
  prefixCls?: string;
  entityType?: string;
  decorator?: unknown;
  focusable?: boolean;
  languages?: Languages;
  uploadProps?: UploadProps;
}

const createImagePlugin = ({
  prefixCls,
  entityType = 'image',
  decorator,
  focusable = true,
  languages = lang,
  uploadProps,
}: ImagePluginConfig = {}): EditorPlugin & {
  ImageButton: ComponentType<ImageButtonProps>;
} => {
  const store = createStore<StoreItemMap>({
    entityKeyMap: {},
  });

  const addImage = getAddImage(entityType, store);
  const updateImage = getUpdateImage(store);

  const defaultUploadProps: UploadProps = {
    name: 'file',
    action: 'https://images.weserv.nl/',
    showUploadList: false,
    beforeUpload: (file) => {
      const getEditorState = store.getItem('getEditorState');
      const setEditorState = store.getItem('setEditorState');
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
    onChange: (info) => {
      const getEditorState = store.getItem('getEditorState');
      const setEditorState = store.getItem('setEditorState');
      if (info.file.status === 'done') {
        setEditorState(
          updateImage(getEditorState(), {
            src: info.file.response.linkurl as string,
            uid: info.file.uid,
            status: 'success',
          }),
        );
      }
    },
  };

  let ImageUploader: React.FC<ImageUploaderProps> = (props) => (
    <DefaultImageUploader
      {...props}
      prefixCls={prefixCls}
      languages={languages}
      uploadProps={defaultUploadProps}
    />
  );

  const ImageButton: React.FC<ImageButtonProps> = (props) => (
    <DefaultImageButton
      {...props}
      languages={languages}
      uploadProps={defaultUploadProps}
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
    initialize({ getEditorState, setEditorState }) {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
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
