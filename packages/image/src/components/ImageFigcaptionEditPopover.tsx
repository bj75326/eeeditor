import React, { useContext, useState, useRef, useEffect } from 'react';
import { Languages, Locale, zhCN, ImagePluginStore } from '..';
import classNames from 'classnames';
import { EEEditorContext } from '@eeeditor/editor';

export interface ImageFigcaptionEditPopoverProps {
  prefixCls?: string;
  className?: string;
  languages?: Languages;
  store?: ImagePluginStore;
}

const ImageFigcaptionEditPopover: React.FC<ImageFigcaptionEditPopoverProps> = (
  props,
) => {
  const { prefixCls: customizePrefixCls, className, languages, store } = props;

  const { getProps } = store.getItem('imagePluginMethods');

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls: getEEEPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getEEEPrefixCls('image', customizePrefixCls);

  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

  const popoverRef = useRef<HTMLDivElement>();

  const onStoredVisibleChange = (visible: boolean) => {
    // setPopoverVisible 触发重新渲染
    setPopoverVisible(visible);
  };

  useEffect(() => {
    store.subscribeToItem(
      'figcaptionEditPopoverVisible',
      onStoredVisibleChange,
    );
    return () => {
      store.unsubscribeFromItem(
        'figcaptionEditPopoverVisible',
        onStoredVisibleChange,
      );
    };
  }, []);

  const onFigcaptionTextareaBlur = () => {
    console.log('onFigcaptionTextareaBlur');

    setPopoverVisible(false);
  };

  const popoverCls = classNames(`${prefixCls}-figcaption-popover`, {
    [`@{prefixCls}-figcaption-popover-hidden`]: !popoverVisible,
  });

  return (
    <div className={popoverCls} ref={popoverRef}>
      <textarea
        className={`${prefixCls}-figcaption-textarea`}
        placeholder={
          locale['eeeditor.image.figcaption.placeholder'] ||
          'eeeditor.image.figcaption.placeholder'
        }
        onBlur={onFigcaptionTextareaBlur}
      />
    </div>
  );
};

export default ImageFigcaptionEditPopover;
