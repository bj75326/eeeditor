import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useState,
  useContext,
  MouseEvent,
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
  setBtnActive: (active: boolean, optionKey: number) => void;
  setBtnDisabled: (disabled: boolean, optionKey: number) => void;
  setBtnIcon: (icon: SelectorButtonProps['icon']) => void;
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
  const [selectorBtnActive, setSelectorBtnActive]: [boolean[], any] = useState(
    [],
  );
  const [selectorBtnDisabled, setSelectorBtnDisabled]: [
    boolean[],
    any,
  ] = useState([]);
  const [selectorBtnIcon, setSelectorBtnIcon]: [ReactNode, any] = useState(
    icon,
  );

  const setBtnActive = (active: boolean, optionKey: number): void => {
    if (active === selectorBtnActive[optionKey]) return;
    setSelectorBtnActive((selectorBtnActive: boolean[]) => {
      const newSelectorBtnActive: boolean[] = [...selectorBtnActive];
      newSelectorBtnActive[optionKey] = active;
      return newSelectorBtnActive;
    });
  };

  const setBtnDisabled = (disabled: boolean, optionKey: number): void => {
    if (disabled === selectorBtnDisabled[optionKey]) return;
    setSelectorBtnDisabled((selectorBtnDisabled: boolean[]) => {
      const newSelectorBtnDisabled: boolean[] = [...selectorBtnDisabled];
      newSelectorBtnDisabled[optionKey] = disabled;
      return newSelectorBtnDisabled;
    });
  };

  const setBtnIcon = (icon: ReactNode): void => {
    setSelectorBtnIcon(icon);
  };

  const showOptions = (): void => {
    setVisible(true);
  };
  const hideOptions = (): void => {
    setVisible(false);
  };

  const preventBubblingUp = (event: MouseEvent): void => {
    event.preventDefault();
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
    setBtnActive,
    setBtnDisabled,
    setBtnIcon,
    tipProps: childrenTipProps,
  };

  const btnClassName = classNames(`${prefixCls}`, className, {
    [`${prefixCls}-active`]: selectorBtnActive.some(
      (status: boolean) => status,
    ),
    [`${prefixCls}-disabled`]: !selectorBtnDisabled.some(
      (status: boolean) => !status,
    ),
    [`${prefixCls}-show`]:
      visible && selectorBtnDisabled.some((status: boolean) => !status),
  });

  const optionsClassName = classNames(`${prefixCls}-options`, {
    [`${prefixCls}-options-hidden`]:
      !visible || !selectorBtnDisabled.some((status: boolean) => !status),
  });

  return (
    <div
      className={`${prefixCls}-wrapper`}
      onMouseEnter={showOptions}
      onMouseLeave={hideOptions}
      onMouseDown={preventBubblingUp}
    >
      <div className={btnClassName} style={style}>
        {selectorBtnActive.some((status: boolean) => status)
          ? selectorBtnIcon
          : icon}
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
