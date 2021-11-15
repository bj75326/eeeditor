import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  CSSProperties,
} from 'react';
import { Languages, Locale, zhCN, ImagePluginStore } from '..';
import classNames from 'classnames';
import {
  EEEditorContext,
  getEditorRootDomNode,
  getPopoverPosition,
  PopoverPosition,
} from '@eeeditor/editor';

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

  const { getProps, getEditorRef } = store.getItem('imagePluginMethods');

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls: getEEEPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getEEEPrefixCls('image', customizePrefixCls);

  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

  const popoverRef = useRef<HTMLDivElement>();

  const styleRef = useRef<CSSProperties>({ top: 0, left: 0 });

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

  useLayoutEffect(() => {
    if (popoverVisible) {
      const editorRoot: HTMLElement = getEditorRootDomNode(getEditorRef());
      const { offsetKey } = store.getItem('getImageProps')();

      const imageFigureDom: HTMLElement =
        editorRoot.ownerDocument.querySelector(
          `figure[data-offset-key="${offsetKey}"]`,
        );
      const imageFigcaptionDom: HTMLElement =
        imageFigureDom.querySelector('figcaption');
      let position: PopoverPosition = getPopoverPosition(
        editorRoot,
        popoverRef.current,
        imageFigcaptionDom,
      );

      styleRef.current = {
        top: `${(position && position.top) || 0}px`,
        left: `${(position && position.left) || 0}px`,
      };
    }
  }, [popoverVisible]);

  const popoverCls = classNames(className, `${prefixCls}-figcaption-popover`, {
    [`${prefixCls}-figcaption-popover-hidden`]: !popoverVisible,
  });

  return (
    <div
      className={popoverCls}
      style={{ ...styleRef.current }}
      ref={popoverRef}
    >
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
