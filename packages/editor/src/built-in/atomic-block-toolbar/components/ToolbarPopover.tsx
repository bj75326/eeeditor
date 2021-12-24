import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import {
  EEEditorContext,
  getEditorRootDomNode,
  getPopoverPosition,
  PopoverPosition,
  getPopoverPlacement,
  PluginMethods,
  ContentBlock,
} from '../../..';
import CSSMotion from 'rc-motion';
import { ConfigContext } from 'antd/lib/config-provider';
import { Store } from '@draft-js-plugins/utils';
import { AtomicBlockProps } from '..';

export interface ToolbarPopoverProps {
  prefixCls?: string;
  className?: string;
  store: Store<{
    // 控制显示隐藏
    toolbarPopoverOffsetKey?: string;
    pluginMethods?: PluginMethods;
    getBlockProps?: () => Partial<AtomicBlockProps>;
  }>;
  children?: ReactElement | ReactElement[];
}

export interface ToolbarPopoverChildrenProps {
  placement: 'top' | 'bottom';
  getBlockProps: () => Partial<AtomicBlockProps>;
  pluginMethods: PluginMethods;
}

export const ToolbarPopover: React.FC<ToolbarPopoverProps> = (props) => {
  const { prefixCls: customizePrefixCls, className, store, children } = props;

  const { getEditorRef } = store.getItem('pluginMethods');

  const { getPrefixCls: getEEEPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getEEEPrefixCls(undefined, customizePrefixCls);

  const [popoverOffsetKey, setPopoverOffsetKey] = useState<string>('');

  const [position, setPosition] = useState<PopoverPosition>();
  const [placement, setPlacement] = useState<'top' | 'bottom'>();

  const popoverRef = useRef<HTMLDivElement>();

  // children props
  const childrenProps: ToolbarPopoverChildrenProps = {
    placement,
    getBlockProps: store.getItem('getBlockProps'),
    pluginMethods: store.getItem('pluginMethods'),
  };

  // 监听 stored visible 变化改变来控制 popover 显示隐藏
  const onStoredOffsetKeyChange = (popoverOffsetKey: string) => {
    setPopoverOffsetKey(popoverOffsetKey);
  };

  useEffect(() => {
    store.subscribeToItem('toolbarPopoverOffsetKey', onStoredOffsetKeyChange);
    return () => {
      store.unsubscribeFromItem(
        'toolbarPopoverOffsetKey',
        onStoredOffsetKeyChange,
      );
    };
  }, []);

  const handlePopoverAppearPrepare = (popoverElement: HTMLElement): void => {
    const root: HTMLElement = getContainer().firstChild as HTMLElement;
    const placement = getPopoverPlacement(root);
    setPlacement(placement);
    setPosition(getPopoverPosition(root, popoverElement, root, placement));
  };

  // 处理鼠标操作引起的 selection 变化，导致的 popover 位置可能不会被重新计算的问题
  // const onDocumentClick = (event: MouseEvent) => {
  //   const { target } = event;
  //   const popoverNode = popoverRef.current || null;
  //   if (!contains(popoverNode, target as Node)) {
  //     setPopoverOffsetKey('');
  //   }
  // };

  // useEffect(() => {
  //   let currentDocument: Document =
  //     getEditorRootDomNode(getEditorRef()).ownerDocument || window.document;
  //   const cleanOutsiderHandler = addEventListener(
  //     currentDocument,
  //     'mousedown',
  //     onDocumentClick,
  //   );
  //   return () => {
  //     cleanOutsiderHandler.remove();
  //   };
  // }, []);

  // 处理 keyboard 操作引起的 selection 变化，导致的 popover 位置可能不会被重新计算的问题
  // const onEditorRootDomKeyDown = (event: KeyboardEvent) => {
  //   if (event.keyCode >= 37 && event.keyCode <= 40) {
  //     setPopoverOffsetKey('');
  //   }
  // };

  // useEffect(() => {
  //   let editorRootDom = getEditorRootDomNode(getEditorRef());
  //   const cleanOutsiderHandler = addEventListener(
  //     editorRootDom,
  //     'keydown',
  //     onEditorRootDomKeyDown,
  //   );
  //   return () => {
  //     cleanOutsiderHandler.remove();
  //   };
  // }, []);

  const getContainer = () => {
    if (getEditorRef()) {
      return getEditorRootDomNode(getEditorRef()).ownerDocument.querySelector(
        `[data-block="true"][data-offset-key="${popoverOffsetKey}"]`,
      );
    }
    return null;
  };

  const { getPrefixCls: getAntdPrefixCls } = useContext(ConfigContext);

  const toolbarPopoverCls = classNames(
    `${prefixCls}-popover`,
    `${prefixCls}-image-toolbar-popover`,
    className,
  );

  return getContainer()
    ? createPortal(
        <CSSMotion
          visible={!!popoverOffsetKey}
          motionName={`${
            getAntdPrefixCls ? getAntdPrefixCls() : 'ant'
          }-zoom-big`}
          motionDeadline={1000}
          leavedClassName={`${getEEEPrefixCls()}-hidden`}
          removeOnLeave={false}
          ref={popoverRef}
          onAppearPrepare={handlePopoverAppearPrepare}
        >
          {({ style, className }, motionRef) => (
            <div
              className={classNames(toolbarPopoverCls, className)}
              style={{
                ...style,
                top: `${(position && position.top) || 0}px`,
                left: `${(position && position.left) || 0}px`,
              }}
              ref={motionRef}
            >
              <div className={`${prefixCls}-popover-content`}>
                <div className={`${prefixCls}-popover-inner`}>
                  {React.Children.map<ReactElement, ReactElement>(
                    children,
                    (child) =>
                      React.cloneElement(child, {
                        ...childrenProps,
                        ...child.props,
                      }),
                  )}
                </div>
              </div>
            </div>
          )}
        </CSSMotion>,
        getContainer(),
      )
    : null;
};

export default ToolbarPopover;
