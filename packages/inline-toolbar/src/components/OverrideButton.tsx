import React, {
  CSSProperties,
  ReactNode,
  ReactElement,
  useContext,
  useState,
} from 'react';
import {
  EditorState,
  PluginMethods,
  EditorPlugin,
  EEEditorContext,
} from '@eeeditor/editor';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import { ToolbarChildrenProps } from './Toolbar';
import classNames from 'classnames';

export interface OverrideBtnChildrenProps extends Partial<PluginMethods> {
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
  setBtnIcon: (icon: OverrideButtonProps['icon']) => void;
  // selector button  默认的 button tip props
  tipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
}

export interface OverrideButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  icon?: ReactNode;
  childrenTipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
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
    childrenTipProps = { placement: 'top' },
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
    handleOverride,
  } = props;

  const { getPrefixCls } = useContext(EEEditorContext);
  const prefixCls = getPrefixCls('override-btn', customizePrefixCls);

  const [overrideBtnActive, setOverrideBtnActive]: [boolean[], any] = useState(
    [],
  );
  const [overrideBtnDisabled, setOverrideBtnDisabled]: [
    boolean[],
    any,
  ] = useState([]);
  const [overrideBtnIcon, setOverrideBtnIcon]: [ReactNode, any] = useState(
    icon,
  );

  const setBtnActive = (active: boolean, optionKey: number): void => {
    if (active === overrideBtnActive[optionKey]) return;
    setOverrideBtnActive((overrideBtnActive: boolean[]) => {
      const newOverrideBtnActive: boolean[] = [...overrideBtnActive];
      newOverrideBtnActive[optionKey] = active;
      return newOverrideBtnActive;
    });
  };

  const setBtnDisabled = (disabled: boolean, optionKey: number): void => {
    if (disabled === overrideBtnDisabled[optionKey]) return;
    setOverrideBtnDisabled((overrideBtnDisabled: boolean[]) => {
      const newOverrideBtnDisabled: boolean[] = [...overrideBtnDisabled];
      newOverrideBtnDisabled[optionKey] = disabled;
      return newOverrideBtnDisabled;
    });
  };

  const setBtnIcon = (icon: ReactNode): void => {
    setOverrideBtnIcon(icon);
  };

  const childProps: OverrideBtnChildrenProps = {
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
    [`${prefixCls}-active`]: overrideBtnActive.some(
      (status: boolean) => status,
    ),
    [`${prefixCls}-disabled`]: !overrideBtnDisabled.some(
      (status: boolean) => !status,
    ),
  });

  return <div className={``}></div>;
};

const DecoratedOverrideButton: React.FC<OverrideButtonProps> = (props) => (
  <OverriderButton {...props} />
);

export default DecoratedOverrideButton;
