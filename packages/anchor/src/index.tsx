import React, { ComponentType } from 'react';
import {
  EditorPlugin,
  PluginMethods,
  EditorState,
  DecoratedOffset,
} from '@eeeditor/editor';
import DefaultLink, { LinkProps, LinkExtraProps } from './components/Link';
import DefaultLinkButton, {
  LinkButtonProps,
  LinkButtonExtraProps,
} from './components/LinkButton';
import linkStrategy from './linkStrategy';
import { createStore, Store } from '@draft-js-plugins/utils';
import lang, { Languages } from './locale';
import DefaultLinkEditPopover, {
  LinkEditPopoverProps,
} from './components/LinkEditPopover';
import DefaultLinkPopover, { LinkPopoverProps } from './components/LinkPopover';

export * from './locale';

export interface LinkEntityData {
  url: string;
}

export interface StoreItemMap {
  getEditorState?(): EditorState;
  setEditorState?(editorState: EditorState): void;
  getProps?: PluginMethods['getProps'];
  getEditorRef?: PluginMethods['getEditorRef'];
  // popover
  getLinkProps?: () => LinkProps;
  // link edit popover
  editPopoverVisible?: boolean;
  mode?: 'edit' | 'new';
  // link popover
  linkPopoverVisible?: boolean;
  onPopoverMouseEnter?: () => void;
  onPopoverMouseLeave?: () => void;

  // initText?: string;
  // initLink?: string;
  // entityKey?: string;
  // offsetKey?: string;
  // linkOffset?: DecoratedOffset;
}

export type AnchorPluginStore = Store<StoreItemMap>;

export type AnchorPlugin = EditorPlugin & {
  LinkButton: ComponentType<LinkButtonProps>;
};

export interface AnchorPluginConfig {
  prefixCls?: string;
  linkClassName?: string;
  linkEditPopoverCls?: string;
  linkPopoverCls?: string;
  linkComponent?: ComponentType<LinkProps & LinkExtraProps>;
  linkButtonComponent?: ComponentType<LinkButtonProps & LinkButtonExtraProps>;
  linkEditPopoverComponent?: ComponentType<LinkEditPopoverProps>;
  linkPopoverComponent?: ComponentType<LinkPopoverProps>;
  languages?: Languages;
}

const createAnchorPlugin = ({
  prefixCls,
  linkClassName,
  linkEditPopoverCls,
  linkPopoverCls,
  linkComponent: LinkComponent = DefaultLink,
  linkButtonComponent: LinkButtonComponent = DefaultLinkButton,
  linkEditPopoverComponent: LinkEditPopoverComponent = DefaultLinkEditPopover,
  linkPopoverComponent: LinkPopoverComponent = DefaultLinkPopover,
  languages = lang,
}: AnchorPluginConfig = {}): AnchorPlugin => {
  const store = createStore<StoreItemMap>();

  let Link: React.FC<LinkProps> = (props) => (
    <LinkComponent
      {...props}
      store={store}
      className={linkClassName}
      prefixCls={prefixCls}
      languages={languages}
    />
  );

  const LinkButton: React.FC<LinkButtonProps> = (props) => (
    <LinkButtonComponent {...props} languages={languages} store={store} />
  );

  const LinkEditPopover: React.FC = () => (
    <LinkEditPopoverComponent
      store={store}
      className={linkEditPopoverCls}
      prefixCls={prefixCls}
      languages={languages}
    />
  );

  const LinkPopover: React.FC = () => (
    <LinkPopoverComponent
      store={store}
      className={linkPopoverCls}
      prefixCls={prefixCls}
      languages={languages}
    />
  );

  return {
    initialize: ({
      getEditorState,
      setEditorState,
      getProps,
      getEditorRef,
    }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
      store.updateItem('getProps', getProps);
      store.updateItem('getEditorRef', getEditorRef);
    },

    decorators: [
      {
        strategy: linkStrategy,
        component: Link,
      },
    ],

    LinkButton,

    suffix: () => (
      <>
        <LinkPopover />
        <LinkEditPopover />
      </>
    ),
  };
};

export default createAnchorPlugin;
