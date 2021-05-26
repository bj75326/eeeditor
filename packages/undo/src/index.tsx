import React, { CSSProperties, ReactNode } from 'react';
import {
  EditorPlugin,
  EditorState,
  KeyCommand,
  checkKeyCommand,
  PluginMethods,
} from '@eeeditor/editor';
import { createStore, Store } from '@draft-js-plugins/utils';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import UndoButton from './components/UndoButton';
import RedoButton from './components/RedoButton';
import lang, { Languages } from './locale';

export * from './locale';

export interface DecoratedUndoRedoButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
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
  getProps?: PluginMethods['getProps'];
  undoButtonRendered?: number;
  undoButtonKeyBindingFn?: EditorPlugin['keyBindingFn'];
  undoButtonKeyCommandHandler?: EditorPlugin['handleKeyCommand'];
  redoButtonRendered?: number;
  redoButtonKeyBindingFn?: EditorPlugin['keyBindingFn'];
  redoButtonKeyCommandHandler?: EditorPlugin['handleKeyCommand'];
}

export type UndoPluginStore = Store<StoreItemMap>;

export interface UndoRedoButtonProps extends DecoratedUndoRedoButtonProps {
  store: UndoPluginStore;
  languages?: Languages;
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
  languages?: Languages;
}

export default ({
  undoKeyCommand = {
    keyCode: 90,
    hasCommandModifier: true,
    isShiftKeyCommand: false,
  },
  redoKeyCommand = {
    keyCode: 90,
    hasCommandModifier: true,
    isShiftKeyCommand: true,
  },
  languages = lang,
}: UndoPluginConfig): UndoPlugin => {
  const store = createStore<StoreItemMap>({
    undoButtonRendered: 0,
    redoButtonRendered: 0,
  });

  // const extraProps: Omit<
  //   UndoRedoButtonProps,
  //   keyof DecoratedUndoRedoButtonProps
  // > = {
  //   store,
  //   // 提供方法给 buttons 动态增减 handleKeyCommand
  //   addKeyCommandHandler: (keyCommandHandler) => {
  //     const keyCommandHandlers = store.getItem('keyCommandHandlers');
  //     store.updateItem('keyCommandHandlers', [
  //       ...keyCommandHandlers.filter(
  //         (handler) => handler !== keyCommandHandler,
  //       ),
  //       keyCommandHandler,
  //     ]);
  //   },
  //   removeKeyCommandHandler: (keyCommandHandler) => {
  //     const keyCommandHandlers = store.getItem('keyCommandHandlers');
  //     store.updateItem(
  //       'keyCommandHandlers',
  //       keyCommandHandlers.filter((handler) => handler !== keyCommandHandler),
  //     );
  //   },
  //   // 提供方法给 buttons 动态增减 keyBindingFn
  //   addKeyBindingFn: (keyBindingFn) => {
  //     const keyBindingFns = store.getItem('keyBindingFns');
  //     store.updateItem('keyBindingFns', [
  //       ...keyBindingFns.filter((fn) => fn !== keyBindingFn),
  //       keyBindingFn,
  //     ]);
  //   },
  //   removeKeyBindingFn: (keyBindingFn) => {
  //     const keyBindingFns = store.getItem('keyBindingFns');
  //     store.updateItem(
  //       'keyBindingFns',
  //       keyBindingFns.filter((fn) => fn !== keyBindingFn),
  //     );
  //   },
  // };

  const DecoratedUndoButton: React.FC<DecoratedUndoRedoButtonProps> = (
    props,
  ) => <UndoButton {...props} store={store} languages={languages} />;

  const DecoratedRedoButton: React.FC<DecoratedUndoRedoButtonProps> = (
    props,
  ) => <RedoButton {...props} store={store} languages={languages} />;

  return {
    initialize: ({ getEditorState, setEditorState, getProps }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
      store.updateItem('getProps', getProps);
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
      console.log('undo keyBindingFn');
      const undoButtonRendered = store.getItem('undoButtonRendered');
      const redoButtonRendered = store.getItem('redoButtonRendered');
      const undoButtonKeyBindingFn = store.getItem('undoButtonKeyBindingFn');
      const redoButtonKeyBindingFn = store.getItem('redoButtonKeyBindingFn');

      if (!!undoButtonRendered && undoButtonKeyBindingFn) {
        const command = undoButtonKeyBindingFn(event, pluginFunctions);
        if (command !== undefined) {
          return command;
        }
      }
      if (!!redoButtonRendered && redoButtonKeyBindingFn) {
        const command = redoButtonKeyBindingFn(event, pluginFunctions);
        if (command !== undefined) {
          return command;
        }
      }
      if (undoKeyCommand && !!!undoButtonRendered) {
        if (checkKeyCommand(undoKeyCommand, event)) {
          return 'undo';
        }
      }
      if (redoKeyCommand && !!!redoButtonRendered) {
        if (checkKeyCommand(redoKeyCommand, event)) {
          return 'redo';
        }
      }
      return undefined;
    },

    handleKeyCommand: (command, editorState, pluginFunctions) => {
      const undoButtonRendered = store.getItem('undoButtonRendered');
      const redoButtonRendered = store.getItem('redoButtonRendered');
      const undoButtonKeyCommandHandler = store.getItem(
        'undoButtonKeyCommandHandler',
      );
      const redoButtonKeyCommandHandler = store.getItem(
        'redoButtonKeyCommandHandler',
      );

      if (!!undoButtonRendered && undoButtonKeyCommandHandler) {
        const result = undoButtonKeyCommandHandler(
          command,
          editorState,
          pluginFunctions,
        );
        if (result === 'handled') {
          return 'handled';
        }
      }
      if (!!redoButtonRendered && redoButtonKeyCommandHandler) {
        const result = redoButtonKeyCommandHandler(
          command,
          editorState,
          pluginFunctions,
        );
        if (result === 'handled') {
          return 'handled';
        }
      }
      if (!!!undoButtonRendered) {
        if (command === 'undo') {
          pluginFunctions.setEditorState(EditorState.undo(editorState));
          return 'handled';
        }
      }
      if (!!!redoButtonRendered) {
        if (command === 'redo') {
          pluginFunctions.setEditorState(EditorState.redo(editorState));
          return 'handled';
        }
      }
      return 'not-handled';
    },

    DecoratedUndoButton,
    DecoratedRedoButton,
  };
};
