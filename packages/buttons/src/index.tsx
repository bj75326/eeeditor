import { ComponentType, CSSProperties } from 'react';
import { EditorState } from 'draft-js';
import createBlockStyleButton from './utils/createBlockStyleButton';
import { AbstractTooltipProps } from 'antd/es/tooltip';

export interface Locale {}

export type EEEditorButtonType = 'header' | 'bold' | 'italic';

export interface EEEditorButtonProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  locale?: Locale;
  title?: string;
  align?: AbstractTooltipProps['align'];
}

export interface EEEditorStyleButtonProps extends EEEditorButtonProps {
  getEditorState(): EditorState;
  setEditorState(editorState: EditorState): void;
}

export type EEEditorStyleButtonType = ComponentType<EEEditorStyleButtonProps>;

export {};
