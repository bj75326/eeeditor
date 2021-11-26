import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  CSSProperties,
} from 'react';
import { Languages, Locale, zhCN, ImagePluginStore } from '..';
import classNames from 'classnames';
import { EEEditorContext, getEditorRootDomNode } from '@eeeditor/editor';
import { Tooltip } from 'antd';
import CSSMotion from 'rc-motion';
import { ConfigContext } from 'antd/lib/config-provider';

export interface ImageToolbarPopoverProps {
  prefixCls?: string;
  className?: string;
  languages?: Languages;
  store?: ImagePluginStore;
}

const ImageToolbarPopover: React.FC<ImageToolbarPopoverProps> = (props) => {
  const { prefixCls: customizePrefixCls, className, languages, store } = props;

  const { getProps, getEditorRef } = store.getItem('imagePluginMethods');

  let locale: Locale = zhCN;
  if (getProps && languages) {
    const { locale: currLocale } = getProps();
    locale = languages[currLocale] || zhCN;
  }

  const { getPrefixCls: getEEEPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getEEEPrefixCls(undefined, customizePrefixCls);

  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

  const popoverRef = useRef<HTMLDivElement>();

  const arrowPositionRef = useRef<'top' | 'bottom'>('top');

  const styleRef = useRef<CSSProperties>({});

  // 监听 stored visible 变化改变来控制 popover 显示隐藏
  const onStoredVisibleChange = (visible: boolean) => {
    setPopoverVisible(visible);
  };

  useEffect(() => {
    store.subscribeToItem('toolbarPopoverVisible', onStoredVisibleChange);
    return () => {
      store.unsubscribeFromItem('toolbarPopoverVisible', onStoredVisibleChange);
    };
  }, []);

  const handlePopoverEnterPrepare = (popoverElement: HTMLElement): void => {
    const editorRoot: HTMLElement = getEditorRootDomNode(getEditorRef());

    const { offsetKey, block } = store.getItem('getImageProps')();
  };

  const { getPrefixCls: getAntdPrefixCls } = useContext(ConfigContext);

  const toolbarPopoverCls = classNames(
    `${prefixCls}-popover`,
    `${prefixCls}-image-toolbar-popover`,
    className,
  );

  const arrowCls = classNames(`${prefixCls}-popover-arrow`, {
    [`${prefixCls}-popover-arrow-top`]: arrowPositionRef.current === 'top',
    [`${prefixCls}-popover-arrow-bottom`]:
      arrowPositionRef.current === 'bottom',
  });

  return (
    <CSSMotion
      visible={popoverVisible}
      motionName={`${getAntdPrefixCls ? getAntdPrefixCls() : 'ant'}-zoom-big`}
      motionDeadline={1000}
      leavedClassName={`${getEEEPrefixCls()}-hidden`}
      removeOnLeave={false}
      ref={popoverRef}
      onEnterPrepare={handlePopoverEnterPrepare}
    >
      {({ style, className }, motionRef) => (
        <div
          className={classNames(toolbarPopoverCls, className)}
          style={{
            ...style,
            ...styleRef.current,
          }}
          ref={motionRef}
        >
          <div className={`${prefixCls}-popover-content`}>
            <div className={arrowCls}>
              <span className={`${prefixCls}-popover-arrow-content`} />
            </div>
            <div className={`${prefixCls}-popover-inner`}></div>
          </div>
        </div>
      )}
    </CSSMotion>
  );
};

export default ImageToolbarPopover;
