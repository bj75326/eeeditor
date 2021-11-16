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
import { EEEditorContext, getEditorRootDomNode } from '@eeeditor/editor';
import {
  getFigcaptionEditPopoverPosition,
  PopoverPosition,
} from '../utils/getFigcaptionEditPopoverPosition';

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
  const textareaRef = useRef<HTMLTextAreaElement>();

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
    store.updateItem('figcaptionEditPopoverVisible', false);

    // 更改
  };

  // 获取 popover 位置
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
      let position: PopoverPosition = getFigcaptionEditPopoverPosition(
        editorRoot,
        popoverRef.current,
        imageFigcaptionDom,
      );
      // 直接更改 dom
      popoverRef.current.style.top = `${position.top}px`;
      popoverRef.current.style.left = `${position.left}px`;
    }
  }, [popoverVisible]);

  useEffect(() => {
    // todo 为什么 useLayoutEffect 内获取焦点不起作用？
    if (popoverVisible) {
      textareaRef.current.select();
    }
  }, [popoverVisible]);

  const popoverCls = classNames(className, `${prefixCls}-figcaption-popover`, {
    [`${prefixCls}-figcaption-popover-hidden`]: !popoverVisible,
  });

  return (
    <div className={popoverCls} ref={popoverRef}>
      <textarea
        className={`${prefixCls}-figcaption-textarea`}
        placeholder={
          locale['eeeditor.image.figcaption.placeholder'] ||
          'eeeditor.image.figcaption.placeholder'
        }
        ref={textareaRef}
        onBlur={onFigcaptionTextareaBlur}
      />
    </div>
  );
};

export default ImageFigcaptionEditPopover;
