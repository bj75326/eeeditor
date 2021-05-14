import React, { ComponentType } from 'react';
import { EditorPlugin, EditorState } from '@eeeditor/editor';
import Link from './components/Link';
import LinkButton, {
  LinkButtonProps,
  LinkButtonExtraProps,
} from './components/LinkButton';
import { createStore, Store } from '@draft-js-plugins/utils';

export interface Locale {}

export interface StoreItemMap {
  getEditorState?(): EditorState;
  setEditorState?(state: EditorState): void;
}

export type AnchorPlugin = EditorPlugin & {
  LinkButton: ComponentType<LinkButtonProps>;
};

export interface AnchorPluginConfig {}

const createAnchorPlugin = ({}: AnchorPluginConfig): AnchorPlugin => {
  const store = createStore<StoreItemMap>({});

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },

    LinkButton,
  };
};

export default createAnchorPlugin;
