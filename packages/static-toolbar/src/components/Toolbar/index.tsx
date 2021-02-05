import React from 'react';
import { EditorState } from 'draft-js';
import { StaticToolbarPluginStore, Locale } from '../..';

export interface ToolbarChildrenProps {
  getEditorState: () => EditorState;
  setEditorState: (editorState: EditorState) => void; 
}

export interface ToolbarPubProps { 
  prefixCls?: string;
  className?: string;
  style?: string;
  locale?: Locale;   
  children?: React.FC<ToolbarChildrenProps>;
}

interface ToolbarProps extends ToolbarPubProps {
  store: StaticToolbarPluginStore;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
    
};

export default Toolbar;