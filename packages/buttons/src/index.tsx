import { ComponentType, CSSProperties } from 'react';
import { EditorState } from 'draft-js';
import createBlockStyleButton from './utils/createBlockStyleButton';

export interface Locale {}

export interface EEEditorButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: Locale;
}

export interface EEEditorStyleButtonProps extends EEEditorButtonProps {
  getEditorState(): EditorState;
  setEditorState(editorState: EditorState): void;
}

export type EEEditorStyleButtonType = ComponentType<EEEditorStyleButtonProps>;

export {};
