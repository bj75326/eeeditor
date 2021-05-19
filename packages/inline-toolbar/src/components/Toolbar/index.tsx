import React, {
  CSSProperties,
  ReactElement,
  useState,
  useEffect,
  ComponentType,
} from 'react';
import { EditorState, EditorPlugin, EditorProps } from '@eeeditor/editor';
import { EEEditorStyleButtonType } from '@eeeditor/buttons';
import { InlineToolbarPluginStore } from '../..';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import classNames from 'classnames';

export interface ToolbarChildrenProps {
  getEditorState?: () => EditorState;
  setEditorState?: (editorState: EditorState) => void;
  getProps?: () => EditorProps;
  // 提供方法给 buttons 动态增减 handleKeyCommand
  addKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  removeKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  // 提供方法给 buttons 动态增减 keyBindingFn
  addKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  removeKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  // 提供方法给 buttons 动态增减 handleBeforeInput
  addBeforeInputHandler?: (
    beforeInputHandler: EditorPlugin['handleBeforeInput'],
  ) => void;
  removeBeforeInputHandler?: (
    beforeInputHandler: EditorPlugin['handleBeforeInput'],
  ) => void;
  tipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
}

export interface ToolbarPubProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  childrenTipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  children?: ReactElement | ReactElement[];
}

interface ToolbarProps extends ToolbarPubProps {
  store: InlineToolbarPluginStore;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const [visible, setVisible]: [boolean, any] = useState(false);
  const [position, setPosition]: [
    { top: number; left: number },
    any,
  ] = useState(undefined);
  const [overrideContent, setOverrideContent]: [
    ReactElement | ReactElement[],
    any,
  ] = useState(undefined);

  const {
    prefixCls = 'eee',
    className,
    style,
    childrenTipProps = { placement: 'top' },
    children,
    store,
  } = props;

  const childrenProps: ToolbarChildrenProps = {};

  useEffect(() => {}, []);

  const toolbarClassName = classNames(`${prefixCls}-inline-toolbar`, className);

  return <div className={toolbarClassName}></div>;
};

export default Toolbar;
