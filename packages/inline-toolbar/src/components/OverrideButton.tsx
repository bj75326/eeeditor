import React, {
  CSSProperties,
  ReactNode,
  ReactElement,
  useContext,
  useState,
  MouseEvent,
} from 'react';
import { EEEditorContext } from '@eeeditor/editor';
import { ToolbarChildrenProps } from './Toolbar';
import classNames from 'classnames';
import ReturnButton from './ReturnButton';

// export interface OverrideBtnChildrenProps {
//   setBtnActive: (active: boolean, optionKey: number) => void;
//   setBtnDisabled: (disabled: boolean, optionKey: number) => void;
//   setBtnIcon: (icon: OverrideButtonProps['icon']) => void;
// }

export interface OverrideButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  icon?: ReactNode;
  children: ReactElement | ReactElement[];
}

const OverriderButton: React.FC<OverrideButtonProps & ToolbarChildrenProps> = (
  props,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    icon,
    children,
    onOverride,
  } = props;

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls('override-btn', customizePrefixCls);

  // const [overrideBtnActive, setOverrideBtnActive]: [boolean[], any] = useState(
  //   [],
  // );
  // const [overrideBtnDisabled, setOverrideBtnDisabled]: [
  //   boolean[],
  //   any,
  // ] = useState([]);
  // const [overrideBtnIcon, setOverrideBtnIcon]: [ReactNode, any] = useState(
  //   icon,
  // );

  // const setBtnActive = (active: boolean, optionKey: number): void => {
  //   if (active === overrideBtnActive[optionKey]) return;
  //   setOverrideBtnActive((overrideBtnActive: boolean[]) => {
  //     const newOverrideBtnActive: boolean[] = [...overrideBtnActive];
  //     newOverrideBtnActive[optionKey] = active;
  //     return newOverrideBtnActive;
  //   });
  // };

  // const setBtnDisabled = (disabled: boolean, optionKey: number): void => {
  //   if (disabled === overrideBtnDisabled[optionKey]) return;
  //   setOverrideBtnDisabled((overrideBtnDisabled: boolean[]) => {
  //     const newOverrideBtnDisabled: boolean[] = [...overrideBtnDisabled];
  //     newOverrideBtnDisabled[optionKey] = disabled;
  //     return newOverrideBtnDisabled;
  //   });
  // };

  // const setBtnIcon = (icon: ReactNode): void => {
  //   setOverrideBtnIcon(icon);
  // };

  const preventBubblingUp = (event: MouseEvent): void => {
    event.preventDefault();
  };

  // const childProps: OverrideBtnChildrenProps = {
  //   setBtnActive,
  //   setBtnDisabled,
  //   setBtnIcon,
  // };

  const handleOverride = (event: MouseEvent): void => {
    event.preventDefault();
    const overrideContent = React.Children.map<ReactElement, ReactElement>(
      children,
      (child, index) =>
        React.cloneElement(child, {
          key: index,
        }),
    ).concat(<ReturnButton key={React.Children.count(children)} />);

    onOverride(overrideContent);
  };

  // const btnClassName = classNames(`${prefixCls}`, className, {
  //   [`${prefixCls}-active`]: overrideBtnActive.some(
  //     (status: boolean) => status,
  //   ),
  //   [`${prefixCls}-disabled`]: !overrideBtnDisabled.some(
  //     (status: boolean) => !status,
  //   ),
  // });

  const btnClassName = classNames(`${prefixCls}`, className);

  return (
    <div className={`${prefixCls}-wrapper`} onMouseDown={preventBubblingUp}>
      <div className={btnClassName} style={style} onClick={handleOverride}>
        {icon}
      </div>
    </div>
  );
};

const DecoratedOverrideButton: React.FC<OverrideButtonProps> = (props) => (
  <OverriderButton {...props} />
);

export default DecoratedOverrideButton;
