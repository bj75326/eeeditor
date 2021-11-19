import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  FocusEvent,
} from 'react';
import { Languages, Locale, zhCN, ImagePluginStore } from '..';
import classNames from 'classnames';
import {
  EEEditorContext,
  getEditorRootDomNode,
  EditorState,
} from '@eeeditor/editor';
import {
  getFigcaptionEditPopoverPosition,
  PopoverPosition,
} from '../utils/getFigcaptionEditPopoverPosition';
import updateFigcaption from '../modifiers/updateFigcaption';

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

  const { getProps, getEditorRef, getEditorState, setEditorState } =
    store.getItem('imagePluginMethods');

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

  const onFigcaptionTextareaBlur = (e: FocusEvent) => {
    console.log('onFigcaptionTextareaBlur');
    store.updateItem('figcaptionEditPopoverVisible', false);

    // 更改
    setEditorState(
      updateFigcaption(
        EditorState.forceSelection(
          getEditorState(),
          getEditorState().getSelection(),
        ),
        (e.target as HTMLTextAreaElement).value,
      ),
    );
  };

  // 获取 popover 位置
  useLayoutEffect(() => {
    if (popoverVisible) {
      // 设置位置
      const editorRoot: HTMLElement = getEditorRootDomNode(getEditorRef());
      const { offsetKey, block } = store.getItem('getImageProps')();

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
      popoverRef.current.style.top = `${position.top}px`;
      popoverRef.current.style.left = `${position.left}px`;

      // 设置初始值
      if (textareaRef.current) {
        textareaRef.current.value = block.getData().get('figcaption') || '';
      }
    }
  }, [popoverVisible]);

  useEffect(() => {
    // todo 为什么 useLayoutEffect 内获取焦点不起作用？
    if (popoverVisible && textareaRef.current) {
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
