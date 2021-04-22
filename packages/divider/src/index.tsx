import React, { ComponentType } from 'react';
import {
  ContentBlock,
  EditorPlugin,
  EditorState,
  focusDecorator,
  BlockFocusDecoratorProps,
} from '@eeeditor/editor';
import Divider, { DividerProps } from './components/Divider';
import DividerButton, {
  DividerButtonProps,
  DividerButtonExtraProps,
} from './components/DividerButton';
import addDivider from './modifiers/addDivider';

export interface Locale {
  'eeeditor.divider.button.tip.name'?: string;
  'eeeditor.divider.button.tip.shortcut'?: string;
}

interface DividerPluginConfig {
  entityType?: string;
  dividerComponent?: ComponentType<DividerProps>;
  dividerButtonComponent?: ComponentType<
    DividerButtonProps & DividerButtonExtraProps
  >;
  decorator?: unknown;
  focusable?: boolean;
}

const createDividerPlugin = ({
  entityType = 'divider',
  dividerComponent = Divider,
  dividerButtonComponent: Button = DividerButton,
  decorator,
  focusable = true,
}: DividerPluginConfig): EditorPlugin & {
  DividerButton: ComponentType<DividerButtonProps>;
  addDivider: ReturnType<typeof addDivider>;
} => {
  let Divider = dividerComponent;

  // focusable === true 则需要用 built-in/focus 提供的 decorator 包装之后再渲染
  let FocusableDivider = null;
  if (focusable) {
    // todo
    FocusableDivider = focusDecorator(
      (Divider as unknown) as React.FC<BlockFocusDecoratorProps>,
    );
    if (typeof decorator === 'function') {
      FocusableDivider = decorator(FocusableDivider);
    }
  }

  if (typeof decorator === 'function') {
    Divider = decorator(Divider);
  }

  const DividerButton: React.FC<DividerButtonProps> = (props) => (
    <Button {...props} addDivider={addDivider(entityType)} />
  );

  const isDividerBlock = (
    block: ContentBlock,
    editorState: EditorState,
  ): boolean => {
    if (block.getType() === 'atomic') {
      const contentState = editorState.getCurrentContent();
      const entity = block.getEntityAt(0);
      if (!entity) return false;
      return contentState.getEntity(entity).getType() === entityType;
    }
    return false;
  };

  return {
    blockRendererFn(block, { getEditorState }) {
      if (isDividerBlock(block, getEditorState())) {
        return {
          component: focusable ? FocusableDivider : Divider,
          editable: false,
        };
      }
      return null;
    },

    blockStyleFn(block, { getEditorState }) {
      if (isDividerBlock(block, getEditorState())) {
        return 'pagebreak';
      }
      return '';
    },

    DividerButton,

    addDivider: addDivider(entityType),
  };
};

export default createDividerPlugin;
