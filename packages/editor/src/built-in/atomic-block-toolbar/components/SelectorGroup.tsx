import React, {
  CSSProperties,
  ReactNode,
  ReactElement,
  useContext,
  useState,
  MouseEvent,
  useRef,
} from 'react';
import { ToolbarPopoverChildrenProps } from './ToolbarPopover';
import { EEEditorContext } from '../../../Editor';
import classNames from 'classnames';

export interface SelectorGroupChildrenProps
  extends Partial<ToolbarPopoverChildrenProps> {
  // 兼容 @eeeditor/buttons
  setBtnActive?: (active: boolean, optionKey: number) => void;
  optionKey?: number;
  setBtnIcon?: (icon?: ReactNode) => void;
}

export interface SelectorGroupProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  icon?: ReactNode;
  children: ReactElement | ReactElement[];
}

export const SelectorGroup: React.FC<
  SelectorGroupProps & SelectorGroupChildrenProps
> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    icon,
    children,
    ...childProps
  } = props;

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls('popover-selector-group', customizePrefixCls);

  const [visible, setVisible] = useState<boolean>(false);
  const [groupActive, setGroupActive] = useState<boolean[]>([]);
  const [groupIcon, setGroupIcon] = useState<ReactNode>(icon);

  const preventBubblingUp = (e: MouseEvent) => {
    e.preventDefault();
  };

  const delayTimer = useRef<number>();

  const clearDelayTimer = () => {
    if (delayTimer.current) {
      clearTimeout(delayTimer.current);
      delayTimer.current = null;
    }
  };

  const delaySetOptionsVisible = (visible: boolean) => {
    // 取 antd tooltip 组件 mouseEnterDelay & mouseLeaveDelay 默认值
    const delay = 100;
    // 清除之前的定时器
    clearDelayTimer();
    delayTimer.current = window.setTimeout(() => {
      setVisible(visible);
      // 清除自己的定时器
      clearDelayTimer();
    }, delay);
  };

  const showOptions = (): void => {
    delaySetOptionsVisible(true);
  };

  const hideOptions = (): void => {
    delaySetOptionsVisible(false);
  };

  const setSelectorGroupActive = (active: boolean, optionKey: number): void => {
    if (active === groupActive[optionKey]) return;
    setGroupActive((groupActive: boolean[]) => {
      const newGroupActive = [...groupActive];
      newGroupActive[optionKey] = active;
      return newGroupActive;
    });
  };

  const setSelectorGroupIcon = (icon: ReactNode): void => {
    setGroupIcon(icon);
  };

  const groupChildProps: SelectorGroupChildrenProps = {
    ...childProps,
    // 兼容 @eeeditor/buttons
    setBtnActive: setSelectorGroupActive,
    setBtnIcon: setSelectorGroupIcon,
  };

  const groupCls = classNames(`${prefixCls}`, className, {
    [`${prefixCls}-active`]: groupActive.some((status: boolean) => status),
    [`${prefixCls}-show`]: visible,
  });

  const optionsCls = classNames(`${prefixCls}-options`, {
    [`${prefixCls}-options-hidden`]: !visible,
  });

  return (
    <div className={`${prefixCls}-wrapper`}>
      <div
        className={groupCls}
        style={style}
        onMouseEnter={showOptions}
        onMouseLeave={hideOptions}
        onMouseDown={preventBubblingUp}
      >
        {groupActive.some((status: boolean) => status) ? groupIcon : icon}
      </div>
      <div
        className={optionsCls}
        onMouseEnter={showOptions}
        onMouseLeave={hideOptions}
      >
        {React.Children.map<ReactElement, ReactElement>(
          children,
          (child, index) =>
            React.cloneElement(child, {
              ...groupChildProps,
              optionKey: index,
              ...child.props,
            }),
        )}
      </div>
    </div>
  );
};

export default SelectorGroup;
