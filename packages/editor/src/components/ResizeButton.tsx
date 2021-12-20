import React, { CSSProperties, useState, ReactNode } from 'react';
import { resizeIcon, PluginMethods } from '..';
import { AtomicBlockProps } from '../built-in/atomic-block-toolbar';
import { Tooltip } from 'antd';
import classNames from 'classnames';

export interface ResizeButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export interface ResizeButtonExtraProps {
  placement: 'top' | 'bottom';
  pluginMethods: PluginMethods;
  getBlockProps: () => Partial<AtomicBlockProps>;
}

const ResizeButton: React.FC<ResizeButtonProps & ResizeButtonExtraProps> = (
  props,
) => {
  const {
    prefixCls,
    className,
    style,
    placement,
    pluginMethods,
    getBlockProps,
  } = props;

  const [active, setActive] = useState<boolean>(false);

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  return (
    <>
      <Tooltip title={getTipTitle}></Tooltip>
    </>
  );
};
