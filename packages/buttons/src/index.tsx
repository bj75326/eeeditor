import {ComponentType } from 'react';
import { EditorState } from 'draft-js';
import 

export interface Locale { 

}

export interface EEEditorButtonProps {
  prefixCls?: string;
  className?: string;
  style?: string;
  locale?: Locale;
}

export interface EEEditorStyleButtonProps extends EEEditorButtonProps {
  getEditorState (): EditorState;
  setEditorState (editorState: EditorState): void;
}

export type EEEditorStyleButtonType = ComponentType<EEEditorStyleButtonProps>;

export {

};