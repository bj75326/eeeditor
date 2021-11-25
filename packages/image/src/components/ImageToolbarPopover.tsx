import React, { useContext, useEffect, useState } from 'react';
import { Languages, Locale, zhCN, ImagePluginStore } from '..';
import classNames from 'classnames';
import { EEEditorContext } from '@eeeditor/editor';

export interface ImageToolbarPopoverProps {
  prefixCls?: string;
  className?: string;
  languages?: Languages;
  store?: ImagePluginStore;
}

const ImageToolbarPopover: React.FC<ImageToolbarPopoverProps> = (props) => {
  const { prefixCls: customizePrefixCls, className, languages, store } = props;

  const { getProps } = store.getItem('imagePluginMethods');

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls: getEEEPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getEEEPrefixCls('image', customizePrefixCls);

  const [popoverVisible, setPopoverVisible] = useState<boolean>();

  const onStoredVisibleChange = (visible: boolean) => {
    setPopoverVisible(visible);
  };

  useEffect(() => {}, []);

  return <></>;
};

export default ImageToolbarPopover;
