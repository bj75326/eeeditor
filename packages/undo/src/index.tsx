import React from 'react';
import { EditorPlugin, EditorState } from '@eeeditor/editor';
import { createStore, Store } from '@draft-js-plugins/utils';
import UndoButton from './components/UndoButton';
import RedoButton from './components/RedoButton';

export interface Locale {
  'eeeditor.undo.tip.name': string;
  'eeeditor.undo.tip.shortcut': string;
  'eeeditor.redo.tip.name': string;
  'eeeditor.redo.tip.shortcut': string;
}

export interface StoreItemMap {
  getEditorState?(): EditorState;
  setEditorState?(state: EditorState): void;
}

export type UndoPluginStore = Store<StoreItemMap>;

export type UndoPlugin = EditorPlugin & {};

export default (): UndoPlugin => {
  const store = createStore<StoreItemMap>();

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },
  };
};
