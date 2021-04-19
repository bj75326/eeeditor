import React, { CSSProperties, ReactElement, useEffect, useRef } from 'react';
import { EditorState, EditorPlugin, EditorProps } from '@eeeditor/editor';
import { StaticToolbarPluginStore, Locale } from '../..';
import {
  defaultHeadIcon,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  HeadlineFourButton,
  HeadlineFiveButton,
  HeadlineSixButton,
} from '@eeeditor/buttons';
import classNames from 'classnames';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import SelectorButton from '../SelectorButton';

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
  locale?: Locale;
  childrenTipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  children?: ReactElement | ReactElement[];
}

interface ToolbarProps extends ToolbarPubProps {
  store: StaticToolbarPluginStore;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const {
    prefixCls = 'eee',
    className,
    style,
    locale,
    childrenTipProps = { placement: 'bottom' },
    children,
    store,
  } = props;

  const childrenProps: ToolbarChildrenProps = {
    getEditorState: store.getItem('getEditorState'),
    setEditorState: store.getItem('setEditorState'),
    getProps: store.getItem('getProps'),
    // 提供方法给 buttons 动态增减 handleKeyCommand
    addKeyCommandHandler: (keyCommandHandler) => {
      const keyCommandHandlers = store.getItem('keyCommandHandlers');
      store.updateItem('keyCommandHandlers', [
        ...keyCommandHandlers.filter(
          (handler) => handler !== keyCommandHandler,
        ),
        keyCommandHandler,
      ]);
    },
    removeKeyCommandHandler: (keyCommandHandler) => {
      const keyCommandHandlers = store.getItem('keyCommandHandlers');
      store.updateItem(
        'keyCommandHandlers',
        keyCommandHandlers.filter((handler) => handler !== keyCommandHandler),
      );
    },
    // 提供方法给 buttons 动态增减 keyBindingFn
    addKeyBindingFn: (keyBindingFn) => {
      const keyBindingFns = store.getItem('keyBindingFns');
      store.updateItem('keyBindingFns', [
        ...keyBindingFns.filter((fn) => fn !== keyBindingFn),
        keyBindingFn,
      ]);
    },
    removeKeyBindingFn: (keyBindingFn) => {
      const keyBindingFns = store.getItem('keyBindingFns');
      store.updateItem(
        'keyBindingFns',
        keyBindingFns.filter((fn) => fn !== keyBindingFn),
      );
    },
    // 提供方法给 buttons 动态增减 handleBeforeInput
    addBeforeInputHandler: (beforeInputHandler) => {
      const beforeInputHandlers = store.getItem('beforeInputHandlers');
      store.updateItem('beforeInputHandlers', [
        ...beforeInputHandlers.filter(
          (handler) => handler !== beforeInputHandler,
        ),
        beforeInputHandler,
      ]);
    },
    removeBeforeInputHandler: (beforeInputHandler) => {
      const beforeInputHandlers = store.getItem('beforeInputHandlers');
      store.updateItem(
        'beforeInputHandlers',
        beforeInputHandlers.filter((handler) => handler !== beforeInputHandler),
      );
    },
    // static toolbar 默认的 button tip props
    tipProps: childrenTipProps,
  };

  const defaultButtons = (
    <SelectorButton icon={defaultHeadIcon}>
      <HeadlineOneButton />
      <HeadlineTwoButton />
      <HeadlineThreeButton />
      <HeadlineFourButton />
      <HeadlineFiveButton />
      <HeadlineSixButton />
    </SelectorButton>
  );

  const toolbarClassName = classNames(`${prefixCls}-static-toolbar`, className);

  return (
    <div className={toolbarClassName} style={style}>
      {React.Children.map<ReactElement, ReactElement>(
        children || defaultButtons,
        (child) =>
          React.cloneElement(child, { ...childrenProps, ...child.props }),
      )}
    </div>
  );
};

export default Toolbar;
