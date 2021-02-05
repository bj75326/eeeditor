import React, {ComponentType} from 'react';
import { createStore, Store} from '@draft-js-plugins/utils';
import { EditorPlugin } from '@eeeditor/editor';
import Toolbar, { ToolbarPubProps } from './components/Toolbar';
import { SelectionState, EditorState } from 'draft-js';

export interface Locale { }

export interface StaticToolbarPluginConfig {
  prefixCls?: string;
  className?: string;
  style?: string;
  locale?: Locale;
}

export type StaticToolbarProps = ToolbarPubProps;

export type StaticToolbarPlugin = EditorPlugin & {
  Toolbar: ComponentType<StaticToolbarProps>;
};

export interface StoreItemMap {
  getEditorState?(): EditorState;
  setEditorState?(state: EditorState): void;
  selection?: SelectionState;
}

export type StaticToolbarPluginStore = Store<StoreItemMap>;

export default (config: StaticToolbarPluginConfig = {}): StaticToolbarPlugin => { 
  const store = createStore<StoreItemMap>();

  const StaticToolbar: React.FC<StaticToolbarProps>= (props) => (
    <Toolbar {...props} store={ store}/>
  );
  
};
