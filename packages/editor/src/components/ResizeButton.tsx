import React, { CSSProperties } from 'react';
import { resizeIcon, PluginMethods } from '..';

export interface ResizeButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export interface ResizeButtonExtraProps {
  // tooltip placement
  placement?: 'top' | 'bottom';
  // atomic block props
  pluginMethods?: PluginMethods;
}

// const ResizeButton
