import React, { CSSProperties, ReactNode } from 'react';
import {
  EditorPlugin,
  EditorState,
  KeyCommand,
  KeyBindingUtil,
  checkKeyCommand,
} from '@eeeditor/editor';
import { createStore, Store } from '@draft-js-plugins/utils';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import UndoButton from './components/UndoButton';
import RedoButton from './components/RedoButton';

export interface Locale {
  'eeeditor.undo.tip.name'?: string;
  'eeeditor.undo.tip.shortcut'?: string;
  'eeeditor.redo.tip.name'?: string;
  'eeeditor.redo.tip.shortcut'?: string;
}

export interface DecoratedUndoRedoButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: Locale;
  title?: {
    name?: string;
    shortcut?: string;
  };
  tipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  tipReverse?: boolean;
  children?: ReactNode;
  // shortcut 自定义
  keyCommand?: KeyCommand | false;
}

export interface StoreItemMap {
  getEditorState?(): EditorState;
  setEditorState?(state: EditorState): void;
  keyCommandHandlers?: Array<EditorPlugin['handleKeyCommand']>;
  keyBindingFns?: Array<EditorPlugin['keyBindingFn']>;
  undoButtonRendered: number;
  redoButtonRendered: number;
}

export type UndoPluginStore = Store<StoreItemMap>;

export interface UndoRedoButtonProps extends DecoratedUndoRedoButtonProps {
  store: UndoPluginStore;
  addKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  removeKeyBindingFn?: (keyBindingFn: EditorPlugin['keyBindingFn']) => void;
  addKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
  removeKeyCommandHandler?: (
    keyCommandHandler: EditorPlugin['handleKeyCommand'],
  ) => void;
}

export type UndoPlugin = EditorPlugin & {
  DecoratedUndoButton: React.FC<DecoratedUndoRedoButtonProps>;
  DecoratedRedoButton: React.FC<DecoratedUndoRedoButtonProps>;
};

// 与其他 eeeditor plugins 需要通过在 toolbar 下添加 button 的方式动态添加 KeyBindingFn & HandleKeyCommand 不同，
// Undo plugin 支持在未添加 Undo/Redo button 的前提下，提供 key command 的支持
// 关于 Undo/Redo 自定义快捷键：
// 1. 如果使用 Undo/Redo button 组件，则通过 keyCommand prop 设置
// 2. 如果未使用 Undo/Redo button 组件，则通过 createUndoPlugin config 设置

export interface UndoPluginConfig {
  undoKeyCommand?: KeyCommand | false;
  redoKeyCommand?: KeyCommand | false;
}

export default (
  config: UndoPluginConfig = {
    undoKeyCommand: {
      keyCode: 90,
      hasCommandModifier: true,
      isShiftKeyCommand: false,
    },
    redoKeyCommand: {
      keyCode: 90,
      hasCommandModifier: true,
      isShiftKeyCommand: true,
    },
  },
): UndoPlugin => {
  const store = createStore<StoreItemMap>({
    keyCommandHandlers: [],
    keyBindingFns: [],
    undoButtonRendered: 0,
    redoButtonRendered: 0,
  });

  const extraProps: Omit<
    UndoRedoButtonProps,
    keyof DecoratedUndoRedoButtonProps
  > = {
    store,
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
  };

  const DecoratedUndoButton: React.FC<DecoratedUndoRedoButtonProps> = (
    props,
  ) => <UndoButton {...props} {...extraProps} />;

  const DecoratedRedoButton: React.FC<DecoratedUndoRedoButtonProps> = (
    props,
  ) => <RedoButton {...props} {...extraProps} />;

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },

    // keyBindingFn: (event, pluginFunctions) => {
    //   const keyBindingFns = store.getItem('keyBindingFns');
    //   let result: string | null | undefined = undefined;
    //   return keyBindingFns.some((fn) => {
    //     result = fn(event, pluginFunctions);
    //     return result !== undefined;
    //   })
    //     ? result
    //     : undefined;
    // },

    // handleKeyCommand: (command, editorState, pluginFunctions) => {
    //   const keyCommandHandlers = store.getItem('keyCommandHandlers');
    //   return keyCommandHandlers.some(
    //     (handler) =>
    //       handler(command, editorState, pluginFunctions) === 'handled',
    //   )
    //     ? 'handled'
    //     : 'not-handled';
    // },

    keyBindingFn: (event, pluginFunctions) => {
      const keyBindingFns = store.getItem('keyBindingFns');
      let result: string | null | undefined = undefined;
      if (keyBindingFns) {
        return keyBindingFns.some((fn) => {
          result = fn(event, pluginFunctions);
          return result !== undefined;
        })
          ? result
          : undefined;
      }
      if (config.undoKeyCommand && !!!store.getItem('undoButtonRendered')) {
        if (checkKeyCommand(config.undoKeyCommand, event)) {
          return 'undo';
        }
      }
      if (config.redoKeyCommand && !!!store.getItem('redoButtonRendered')) {
        if (checkKeyCommand(config.redoKeyCommand, event)) {
          return 'redo';
        }
      }
      return undefined;
    },

    handleKeyCommand: (command, editorState, pluginFunctions) => {
      const keyCommandHandlers = store.getItem('keyCommandHandlers');
      if (keyCommandHandlers) {
        return keyCommandHandlers.some(
          (handler) =>
            handler(command, editorState, pluginFunctions) === 'handled',
        )
          ? 'handled'
          : 'not-handled';
      }
      if (config.undoKeyCommand && !!!store.getItem('undoButtonRendered')) {
        // if () {
        // }
      }
    },

    DecoratedUndoButton,
    DecoratedRedoButton,
  };
};
