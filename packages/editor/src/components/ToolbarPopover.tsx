import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  ReactElement,
} from 'react';
import classNames from 'classnames';
import {
  EEEditorContext,
  getEditorRootDomNode,
  getPopoverPosition,
  PopoverPosition,
  getPopoverPlacement,
  PluginMethods,
  ContentBlock,
} from '..';
import CSSMotion from 'rc-motion';
import { ConfigContext } from 'antd/lib/config-provider';
import { Store } from '@draft-js-plugins/utils';

export interface ToolbarPopoverProps {
  prefixCls?: string;
  className?: string;
  store: Store<{
    // 控制显示隐藏
    toolbarPopoverVisible?: boolean;
    pluginMethods?: PluginMethods;
    // atomic block props
    getBlockProps?: () => {
      offsetKey?: string;
      block?: ContentBlock;
    };
  }>;
  children?: ReactElement | ReactElement[];
}

export const ToolbarPopover: React.FC<ToolbarPopoverProps> = (props) => {
  const { prefixCls: customizePrefixCls, className, store, children } = props;

  const { getEditorRef } = store.getItem('pluginMethods');

  const { getPrefixCls: getEEEPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getEEEPrefixCls(undefined, customizePrefixCls);

  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

  const [position, setPosition] = useState<PopoverPosition>();
  const [placement, setPlacement] = useState<'top' | 'bottom'>();

  const popoverRef = useRef<HTMLDivElement>();

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
    const { offsetKey } = store.getItem('getBlockProps')();
    const target: HTMLElement = editorRoot.ownerDocument.querySelector(
      `figure[data-offset-key="${offsetKey}"]`,
    ).firstChild as HTMLElement;

    const placement = getPopoverPlacement(target);
    setPlacement(placement);

    // styleRef.current = {
    //   ...styleRef.current,
    //   transformOrigin: `50% ${popoverElement.offsetHeight + 4} `,
    // };

    setPosition(
      getPopoverPosition(editorRoot, popoverElement, target, placement),
    );
  };

  const { getPrefixCls: getAntdPrefixCls } = useContext(ConfigContext);

  const toolbarPopoverCls = classNames(
    `${prefixCls}-popover`,
    `${prefixCls}-image-toolbar-popover`,
    className,
  );

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
            top: `${(position && position.top) || 0}px`,
            left: `${(position && position.left) || 0}px`,
          }}
          ref={motionRef}
        >
          <div className={`${prefixCls}-popover-content`}>
            <div className={`${prefixCls}-popover-inner`}>{children}</div>
          </div>
        </div>
      )}
    </CSSMotion>
  );
};

export default ToolbarPopover;
