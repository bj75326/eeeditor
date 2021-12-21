import React, { useContext, ReactNode } from 'react';
import {
  ToolbarPopover,
  ToolbarPopoverProps,
  EEEditorContext,
  resizeIcon,
  RadioGroup,
  ResizeButton,
} from '@eeeditor/editor';
import { Languages, zhCN, Locale } from '..';

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

  return (
    <ToolbarPopover prefixCls={prefixCls} className={className} store={store}>
      <RadioGroup>
        <ResizeButton />
      </RadioGroup>
    </ToolbarPopover>
  );
};

export default ImageToolbar;
