import React, { ComponentType, AnchorHTMLAttributes } from 'react';
import { EditorPlugin, EditorState } from '@eeeditor/editor';
import DefaultLink, { LinkProps, LinkExtraProps } from './components/Link';
import DefaultLinkButton, {
  LinkButtonProps,
  LinkButtonExtraProps,
} from './components/LinkButton';
import linkStrategy from './linkStrategy';
import { createStore, Store } from '@draft-js-plugins/utils';

export interface Locale {
  'eeeditor.anchor.button.tip.name'?: string;
  'eeeditor.anchor.button.tip.shortcut'?: string;
  'eeeditor.anchor.edit.button.tip'?: string;
  'eeeditor.anchor.copy.button.tip'?: string;
  'eeeditor.anchor.delete.button.tip'?: string;
}

export interface LinkEntityData {
  url: string;
  mode: 'edit' | 'normal';
  visible: boolean;
}

export interface StoreItemMap {
  getEditorState?(): EditorState;
  setEditorState?(editorState: EditorState): void;
}

export type AnchorPluginStore = Store<StoreItemMap>;

export type AnchorPlugin = EditorPlugin & {
  LinkButton: ComponentType<LinkButtonProps>;
};

export interface AnchorPluginConfig {
  prefixCls?: string;
  linkClassName?: string;
  linkComponent?: ComponentType<LinkProps & LinkExtraProps>;
  linkButtonComponent?: ComponentType<LinkButtonProps>;
}

const createAnchorPlugin = ({
  prefixCls = 'eee',
  linkClassName,
  linkComponent: LinkComponent = DefaultLink,
  linkButtonComponent: LinkButtonComponent = DefaultLinkButton,
}: AnchorPluginConfig): AnchorPlugin => {
  const store = createStore<StoreItemMap>();

  let Link: React.FC<LinkProps> = (props) => (
    <LinkComponent
      {...props}
      store={store}
      className={linkClassName}
      prefixCls={prefixCls}
    />
  );

  const LinkButton: React.FC<LinkButtonProps> = (props) => (
    <LinkButtonComponent {...props} />
  );

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },

    decorators: [
      {
        strategy: linkStrategy,
        component: Link,
      },
    ],

    LinkButton,
  };
};

export default createAnchorPlugin;
