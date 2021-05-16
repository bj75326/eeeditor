import React, { ComponentType, AnchorHTMLAttributes } from 'react';
import { EditorPlugin, EditorState } from '@eeeditor/editor';
import Link from './components/Link';
import LinkButton, {
  LinkButtonProps,
  LinkButtonExtraProps,
} from './components/LinkButton';
import linkStrategy from './linkStrategy';

export interface Locale {}

export type AnchorPlugin = EditorPlugin & {
  LinkButton: ComponentType<LinkButtonProps>;
};

export interface AnchorPluginConfig {
  linkComponent?: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>;
  linkButtonComponent?: ComponentType<LinkButtonProps & LinkButtonExtraProps>;
}

const createAnchorPlugin = ({
  linkComponent = Link,
  linkButtonComponent: Button = LinkButton,
}: AnchorPluginConfig): AnchorPlugin => {
  let Link = linkComponent;

  const LinkButton: React.FC<LinkButtonProps> = (props) => (
    <Button {...props} />
  );

  return {
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
