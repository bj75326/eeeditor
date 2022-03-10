import React, {
  CSSProperties,
  ReactNode,
  ReactElement,
  useContext,
  useState,
  MouseEvent,
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

  const showOptions = (): void => {
    setVisible(true);
  };

  const hideOptions = (): void => {
    setVisible(true);
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
    <div
      className={`${prefixCls}-wrapper`}
      onMouseEnter={showOptions}
      onMouseLeave={hideOptions}
      onMouseDown={preventBubblingUp}
    >
      <div className={groupCls} style={style}>
        {groupActive.some((status: boolean) => status) ? groupIcon : icon}
      </div>
      <div className={optionsCls}>
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
