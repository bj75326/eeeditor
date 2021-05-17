import React, { ReactNode } from 'react';
import { Popover } from 'antd';
import { EditorState } from '@eeeditor/editor';
import { AnchorPluginStore } from '..';

export interface LinkProps {
  children: ReactNode;
  entityKey: string;
  // getEditorState: () => EditorState;
  // setEditorState: (editorState: EditorState) => void;
}

export interface LinkExtraProps {
  prefixCls?: string;
  className?: string;
  store: AnchorPluginStore;
}

const Link: React.FC<LinkProps & LinkExtraProps> = (props) => {
  const { prefixCls, className, store, children, entityKey } = props;

  return <a>{children}</a>;
};

export default Link;
