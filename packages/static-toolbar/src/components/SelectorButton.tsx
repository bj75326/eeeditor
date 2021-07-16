import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useState,
  useContext,
} from 'react';
import { EditorPlugin, PluginMethods, EEEditorContext } from '@eeeditor/editor';
import { ToolbarChildrenProps } from './Toolbar';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import classNames from 'classnames';

export interface SelectorBtnChildrenProps extends Partial<PluginMethods> {
  addKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  removeKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  addKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  removeKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  addBeforeInputHandler?: (
    beforeInputHandler: EditorPlugin['handleBeforeInput'],
  ) => void;
  removeBeforeInputHandler?: (
    beforeInputHandler: EditorPlugin['handleBeforeInput'],
  ) => void;
  setSelectorBtnActive: (active: boolean, optionKey: number) => void;
  setSelectorBtnDisabled: (disabled: boolean, optionKey: number) => void;
  setSelectorBtnIcon: (icon: SelectorButtonProps['icon']) => void;
  // selector button  默认的 button tip props
  tipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
}

export interface SelectorButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  icon?: ReactNode;
  childrenTipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  children: ReactElement | ReactElement[];
}

const SelectorButton: React.FC<SelectorButtonProps & ToolbarChildrenProps> = (
  props,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    icon,
    childrenTipProps = { placement: 'right' },
    children,
    getEditorState,
    setEditorState,
    getProps,
    getEditorRef,
    addKeyCommandHandler,
    removeKeyCommandHandler,
    addKeyBindingFn,
    removeKeyBindingFn,
    addBeforeInputHandler,
    removeBeforeInputHandler,
  } = props;

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls('selector-btn', customizePrefixCls);

  const [visible, setVisible]: [boolean, any] = useState(false);
  const [btnActive, setBtnActive]: [boolean[], any] = useState([]);
  const [btnDisabled, setBtnDisabled]: [boolean[], any] = useState([]);
  const [btnIcon, setBtnIcon]: [ReactNode, any] = useState(icon);

  const setSelectorBtnActive = (active: boolean, optionKey: number): void => {
    if (active === btnActive[optionKey]) return;
    setBtnActive((btnActive: boolean[]) => {
      const newBtnActive: boolean[] = [...btnActive];
      newBtnActive[optionKey] = active;
      return newBtnActive;
    });
  };

  const setSelectorBtnDisabled = (
    disabled: boolean,
    optionKey: number,
  ): void => {
    if (disabled === btnDisabled[optionKey]) return;
    setBtnDisabled((btnDisabled: boolean[]) => {
      const newBtnDisabled: boolean[] = [...btnDisabled];
      newBtnDisabled[optionKey] = disabled;
      return newBtnDisabled;
    });
  };

  const setSelectorBtnIcon = (icon: ReactNode): void => {
    setBtnIcon(icon);
  };

  const showOptions = (): void => {
    setVisible(true);
  };
  const hideOptions = (): void => {
    setVisible(false);
  };

  const childProps: SelectorBtnChildrenProps = {
    getEditorState,
    setEditorState,
    getProps,
    getEditorRef,
    addKeyCommandHandler,
    removeKeyCommandHandler,
    addKeyBindingFn,
    removeKeyBindingFn,
    addBeforeInputHandler,
    removeBeforeInputHandler,
    setSelectorBtnActive,
    setSelectorBtnDisabled,
    setSelectorBtnIcon,
    tipProps: childrenTipProps,
  };

  const btnClassName = classNames(`${prefixCls}`, className, {
    [`${prefixCls}-active`]: btnActive.some((status: boolean) => status),
    [`${prefixCls}-disabled`]: !btnDisabled.some((status: boolean) => !status),
    [`${prefixCls}-show`]:
      visible && btnDisabled.some((status: boolean) => !status),
  });

  const optionsClassName = classNames(`${prefixCls}-options`, {
    [`${prefixCls}-options-hidden`]:
      !visible || !btnDisabled.some((status: boolean) => !status),
  });

  return (
    <div
      className={`${prefixCls}-wrapper`}
      onMouseEnter={showOptions}
      onMouseLeave={hideOptions}
    >
      <div className={btnClassName} style={style}>
        {btnActive.some((status: boolean) => status) ? btnIcon : icon}
      </div>
      <div className={optionsClassName}>
        {React.Children.map<ReactElement, ReactElement>(
          children,
          (child, index) =>
            React.cloneElement(child, {
              ...childProps,
              optionKey: index,
              ...child.props,
            }),
        )}
      </div>
    </div>
  );
};

const DecoratedSelectorButton: React.FC<SelectorButtonProps> = (props) => (
  <SelectorButton {...props} />
);

export default DecoratedSelectorButton;
