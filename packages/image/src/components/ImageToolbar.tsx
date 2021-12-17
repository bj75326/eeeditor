import React, { useContext, ReactNode } from 'react';
import {
  ToolbarPopover,
  ToolbarPopoverProps,
  EEEditorContext,
} from '@eeeditor/editor';
import { Languages, zhCN, Locale } from '..';
import { Tooltip } from 'antd';
import { cropIcon, resizeIcon } from '../assets/extraIcons';

export interface ImageToolbarProps {
  prefixCls?: string;
  className?: string;
  store: ToolbarPopoverProps['store'];
  languages: Languages;
}

const ImageToolbar: React.FC<ImageToolbarProps> = (props) => {
  const { prefixCls: customizePrefixCls, className, store, languages } = props;

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls(undefined, customizePrefixCls);

  let locale: Locale = zhCN;
  const { getProps } = store.getItem('pluginMethods');
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const toggleResizeMode = (): void => {};

  const getTipTitle = (name: string): ReactNode => (
    <span className={`${prefixCls}-tip`}>
      <span className={`${prefixCls}-tip-name`}>{locale[name] || name}</span>
    </span>
  );

  return (
    <ToolbarPopover prefixCls={prefixCls} className={className} store={store}>
      <Tooltip
        title={getTipTitle('eeeditor.image.resize')}
        overlayClassName={`${prefixCls}-tip-wrapper`}
      >
        <span className={`${prefixCls}-popover-button`}>{resizeIcon}</span>
      </Tooltip>
      <Tooltip
        title={getTipTitle('eeeditor.image.crop')}
        overlayClassName={`${prefixCls}-tip-wrapper`}
      >
        <span className={`${prefixCls}-popover-button`}>{cropIcon}</span>
      </Tooltip>
    </ToolbarPopover>
  );
};

export default ImageToolbar;
