import {
  EditorPlugin,
  ContentBlock,
  EditorState,
  EntityInstance,
} from '@eeeditor/editor';
import lang, { Languages } from './locale';
import { UploadProps } from 'antd';
import getAddImage from './modifiers/addImage';

export * from './locale';

export interface ImageEntityData {
  src: string;
  uid: string;
  upload?: boolean;
  status?: 'uploading' | 'error' | 'success';
}

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
}: ImagePluginConfig): EditorPlugin & {} => {
  const addImage = getAddImage(entityType);

  const defaultUploadProps: UploadProps = {
    name: 'file',
    action: 'https://images.weserv.nl/',
    showUploadList: false,
  };

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
      // 添加 upload props
      defaultUploadProps.beforeUpload = (file) => {
        const reader = new FileReader();
        // reader.onload = (e: ProgressEvent<FileReader>) => {
        //   setEditorState(
        //     addImage(
        //       getEditorState(),
        //       {
        //         src: e.target.result as string,
        //         upload: true,
        //         status: 'uploading',
        //       }
        //     ).editorState
        //   );
        // };
        // reader.readAsDataURL(file)
      };

      // defaultUploadProps.
    },

    blockRendererFn(block, { getEditorState }) {
      const entity = getImageEntity(block, getEditorState());
      if (entity) {
        if (entity.getData()['upload']) {
          return {
            component: ImageUploader,
            editable: false,
          };
        }
        return {
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
  };
};

export default createImagePlugin;
