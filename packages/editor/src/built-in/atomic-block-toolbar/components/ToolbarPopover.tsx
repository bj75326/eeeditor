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

  const block =
    store.getItem('getBlockProps') && store.getItem('getBlockProps')().block;

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

  // block 发生变化之后需要重新计算 toolbar 位置
  useEffect(() => {
    if (!!popoverOffsetKey && popoverRef.current) {
      const root: HTMLElement = getContainer().firstChild as HTMLElement;
      setPosition(
        getPopoverPosition(root, popoverRef.current, root, placement),
      );
    }
  }, [block]);

  const getContainer = () => {
    if (getEditorRef()) {
      console.log(
        'ToolbarPopover getContainer 结果 -- ',
        getEditorRootDomNode(getEditorRef()).ownerDocument.querySelector(
          `[data-block="true"][data-offset-key="${popoverOffsetKey}"]`,
        ),
      );
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
