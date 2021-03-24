import React, { CSSProperties, ReactNode } from 'react';
import { EditorPlugin, EditorState } from '@eeeditor/editor';
import { createStore, Store } from '@draft-js-plugins/utils';
import { TooltipPropsWithTitle } from 'antd/es/tooltip';
import UndoButton from './components/UndoButton';
import RedoButton from './components/RedoButton';

export interface Locale {
  'eeeditor.undo.tip.name': string;
  'eeeditor.undo.tip.shortcut': string;
  'eeeditor.redo.tip.name': string;
  'eeeditor.redo.tip.shortcut': string;
}

export interface UndoRedoButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: Locale;
  title?: {
    name?: string;
    shortcut?: string;
  };
  tipProps?: Partial<Omit<TooltipPropsWithTitle, 'title'>>;
  children?: ReactNode;
}

export interface StoreItemMap {
  getEditorState?(): EditorState;
  setEditorState?(state: EditorState): void;
}

export type UndoPluginStore = Store<StoreItemMap>;

export type UndoPlugin = EditorPlugin & {
  DecoratedUndoButton: React.FC<UndoRedoButtonProps>;
  DecoratedRedoButton: React.FC<UndoRedoButtonProps>;
};

export default (): UndoPlugin => {
  const store = createStore<StoreItemMap>();

  const DecoratedUndoButton: React.FC<UndoRedoButtonProps> = (props) => (
    <UndoButton {...props} store={store} />
  );

  const DecoratedRedoButton: React.FC<UndoRedoButtonProps> = (props) => (
    <RedoButton {...props} store={store} />
  );

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },

    DecoratedUndoButton,
    DecoratedRedoButton,
  };
};
