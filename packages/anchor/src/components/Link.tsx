import React, { ReactNode } from 'react';
import { Popover } from 'antd';
import { EditorState } from '@eeeditor/editor';
import { AnchorPluginStore } from '..';
import classNames from 'classnames';
import { editIcon, copyIcon, deleteIcon } from '../assets/extraIcons';

const formatUrl = (href: string): string => {
  if (!/^((ht|f)tps?):\/\//.test(href)) {
    return `http://${href}`;
  }
  return href;
};

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
  console.log('Link Props: ', props);
  const { prefixCls = 'eee', className, store, children, entityKey } = props;

  const getEditorState = store.getItem('getEditorState');
  const setEditorState = store.getItem('setEditorState');

  const entity = getEditorState().getCurrentContent().getEntity(entityKey);

  const entityData = entity ? entity.getData() : undefined;
  const href = (entityData && entityData.url) || '';
  const visible = (entityData && entityData.visible) || undefined;

  const linkClassName = classNames(className, `${prefixCls}-link`);

  const formattedHref = formatUrl(href);
  const popoverContent = (
    <div className={`${prefixCls}-link-popover`}>
      <a
        className={`${prefixCls}-link-url`}
        title={formattedHref}
        href={formattedHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {formattedHref}
      </a>
      <span className={`${prefixCls}-link-btn`}>{editIcon}</span>
      <span className={`${prefixCls}-link-btn`}>{copyIcon}</span>
      <span className={`${prefixCls}-link-btn`}>{deleteIcon}</span>
    </div>
  );

  return (
    <Popover content={popoverContent} visible={visible}>
      <a className={linkClassName} rel="noopener noreferrer">
        {children}
      </a>
    </Popover>
  );
};

export default Link;
