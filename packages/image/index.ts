import React, { ComponentType } from 'react';
import {
  EditorPlugin,
  ContentBlock,
  EditorState,
  EntityInstance,
} from '@eeeditor/editor';
import lang, { Languages } from './locale';

export * from './locale';

interface ImagePluginConfig {
  prefixCls?: string;
  entityType?: string;
  decorator?: unknown;
  focusable?: boolean;
  languages?: Languages;
}

const createImagePlugin = ({
  prefixCls,
  entityType = 'image',
  decorator,
  focusable = true,
  languages = lang,
}: ImagePluginConfig): EditorPlugin & {} => {
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
    blockRendererFn(block, { getEditorState }) {
      const entity = getImageEntity(block, getEditorState());
      if (entity) {
        if (entity.getData()['loading']) {
          return {
            component: ImageLoading,
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
        if (entity.getData()['loading']) {
          return 'image-loading';
        }
        return 'image';
      }
      return '';
    },
  };
};

export default createImagePlugin;
