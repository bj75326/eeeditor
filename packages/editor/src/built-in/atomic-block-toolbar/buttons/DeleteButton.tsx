import React, { CSSProperties } from 'react';
import { PluginMethods } from '../../..';
import lang, { Languages, Locale, zhCN } from '../../../locale';
import classNames from 'classnames';
import { AtomicBlockProps } from '..';

export interface DeleteButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  languages?: Languages;
}

export interface DeleteButtonExtraProps extends Partial<PluginMethods> {
  placement?: 'top' | 'bottom';
  getBlockProps?: () => Partial<AtomicBlockProps>;
}
