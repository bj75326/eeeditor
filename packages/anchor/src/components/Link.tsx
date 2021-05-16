import React, { ReactNode } from 'react';
import { Popover } from 'antd';
import {} from '@eeeditor/editor';

export interface LinkProps {
  // 待定
  children: ReactNode;
  entityKey: string;
}

export interface LinkExtraProps {
  prefixCls?: string;
  className?: string;
}

const Link: React.FC<LinkProps & LinkExtraProps> = (props) => {
  const { children } = props;

  return <a>{children}</a>;
};

export default Link;
