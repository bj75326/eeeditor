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
  setOverrideBtnActive: (active: boolean, optionKey: number) => void;
  setOverrideBtnDisabled: (disabled: boolean, optionKey: number) => void;
  setOverrideBtnIcon: (icon: OverrideButtonProps['icon']) => void;
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

  const [btnActive, setBtnActive]: [boolean[], any] = useState([]);
  const [btnDisabled, setBtnDisabled]: [boolean[], any] = useState([]);
  const [btnIcon, setBtnIcon]: [ReactNode, any] = useState(icon);

  const setOverrideBtnActive = () => {};

  const setOverrideBtnDisabled = () => {};

  const setOverrideBtnIcon = (icon: ReactNode): void => {};

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
    setOverrideBtnActive,
    setOverrideBtnDisabled,
    setOverrideBtnIcon,
  };

  return <div></div>;
};

const DecoratedOverrideButton: React.FC<OverrideButtonProps> = (props) => (
  <OverriderButton {...props} />
);

export default DecoratedOverrideButton;
