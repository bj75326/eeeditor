import React, { useContext, useEffect, useState } from 'react';
import { EEEditorContext } from '@eeeditor/editor';
import { AnchorPluginStore, Languages, Locale, zhCN } from '..';

export interface LinkPopoverProps {
  prefixCls?: string;
  className?: string;
  store?: AnchorPluginStore;
  languages?: Languages;
}

const LinkPopover: React.FC<LinkPopoverProps> = (props) => {
  const { prefixCls: customizePrefixCls, className, store, languages } = props;

  const getEditorState = store.getItem('getEditorState');
  const setEditorState = store.getItem('setEditorState');
  const getProps = store.getItem('getProps');
  const getEditorRef = store.getItem('getEditorRef');

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale];
  }

  const { getPrefixCls: getEEEPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getEEEPrefixCls(undefined, customizePrefixCls);

  const [popoverVisible, setPopoverVisible]: [boolean, any] = useState(false);

  const onStoredVisibleChange = (visible: boolean) => {
    // setPopoverVisible 触发重新渲染
    setPopoverVisible(true);
  };

  useEffect(() => {
    store.subscribeToItem('linkPopoverVisible', onStoredVisibleChange);
    return () => {
      store.unsubscribeFromItem('linkPopoverVisible', onStoredVisibleChange);
    };
  }, []);

  return <div></div>;
};

export default LinkPopover;
