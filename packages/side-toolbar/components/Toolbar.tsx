import React, { CSSProperties, ReactElement } from 'react';
import { PluginMethods, EditorPlugin } from '@eeeditor/editor';
import { EEEditorStyleButtonType } from '@eeeditor/buttons';
import { SideToolbarPluginStore } from '..';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';

export interface ToolbarChildrenProps extends Partial<PluginMethods> {
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
  // 提供给 override buttons 的方法
  onOverride?: (overrideContent: ReactElement | ReactElement[]) => void;
}

export interface ToolbarPubProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  childrenTipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  children?: ReactElement | ReactElement[];
}

interface ToolbarProps extends ToolbarPubProps {
  store: SideToolbarPluginStore;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    childrenTipProps = { placement: 'top' },
    children,
    store,
  } = props;

  const getProps = store.getItem('getProps');
  const getEditorState = store.getItem('getEditorState');
  const getEditorRef = store.getItem('getEditorRef');

  const;
};

export default Toolbar;
